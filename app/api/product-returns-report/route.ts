import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseISO } from "date-fns";

export async function GET(req: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
        }

        const start = parseISO(startDate);
        const end = parseISO(endDate);

        // Ensure both are in UTC format
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);

        const report = await prisma.productReturn.groupBy({
            by: ["reason", "created_at"],
            where: {
                created_at: {
                    gte: start,
                    lte: end,
                },
            },
            _sum: {
                quantity: true,
            },
        });

        // Organize results into a structured format
        const formattedReport: Record<string, { date: string; lost: number; return: number; refund: number; other: number }> = {};

        report.forEach((entry) => {
            const date = entry.created_at.toISOString().split("T")[0];

            if (!formattedReport[date]) {
                formattedReport[date] = { date, lost: 0, return: 0, refund: 0, other: 0 };
            }

            switch (entry.reason) {
                case "Lost":
                    formattedReport[date].lost += entry._sum.quantity || 0;
                    break;
                case "Return":
                    formattedReport[date].return += entry._sum.quantity || 0;
                    break;
                case "Refund":
                    formattedReport[date].refund += entry._sum.quantity || 0;
                    break;
                default:
                    formattedReport[date].other += entry._sum.quantity || 0;
                    break;
            }
        });

        return NextResponse.json({ data: Object.values(formattedReport) }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
