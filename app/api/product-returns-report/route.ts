import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseISO, format } from "date-fns";

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

        // Initialize an object with all months set to zero
        const months = Array.from({ length: 12 }, (_, i) => ({
            month: format(new Date(2025, i, 1), "MMM"),
            lost: 0,
            return: 0,
            refund: 0,
            other: 0,
        }));

        // Aggregate the data by month
        report.forEach((entry) => {
            const monthIndex = new Date(entry.created_at).getMonth();
            switch (entry.reason) {
                case "Lost":
                    months[monthIndex].lost += entry._sum.quantity || 0;
                    break;
                case "Return":
                    months[monthIndex].return += entry._sum.quantity || 0;
                    break;
                case "Refund":
                    months[monthIndex].refund += entry._sum.quantity || 0;
                    break;
                default:
                    months[monthIndex].other += entry._sum.quantity || 0;
                    break;
            }
        });

        return NextResponse.json({ data: months }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
