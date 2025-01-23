import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse, format } from "date-fns";

const parseDateRange = (dateRange: string) => {
    try {
        const [startPart, endPart] = dateRange.split("-");
        const currentYear = new Date().getFullYear();

        // Parse start date (e.g., "Aug 19")
        const startDate = parse(`${startPart.trim()} ${currentYear}`, "MMM d yyyy", new Date());

        if (isNaN(startDate.getTime())) {
            throw new Error("Invalid start date format.");
        }

        // Parse end day and set it for the same month as the start date
        const endDay = parseInt(endPart.trim(), 10);
        if (isNaN(endDay) || endDay < 1 || endDay > 31) {
            throw new Error("Invalid end date format.");
        }

        const endDate = new Date(startDate);
        endDate.setDate(endDay);

        return {
            startDate,
            endDate,
        };
    } catch {
        throw new Error("Invalid date range format. Use format like 'Aug 19-25'.");
    }
};

const getWeeklySalesData = async (dateRange: string) => {
    const { startDate, endDate } = parseDateRange(dateRange);

    const sales = await prisma.salesOrder.findMany({
        where: {
            created_at: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            order_items: {
                include: {
                    product: true,
                },
            },
            payment_method: true,
        },
    });

    // Initialize weekly sales data for the specified week
    const weeklySales: Record<string, Record<string, number>> = {
        "09:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        "10:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        "11:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        "12:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        "13:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        "14:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        "15:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        "16:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    };

    sales.forEach((order) => {
        const orderTime = format(order.created_at, "HH:00");
        const day = format(order.created_at, "EEE").toLowerCase().slice(0, 3);
        if (weeklySales[orderTime] && day in weeklySales[orderTime]) {
            weeklySales[orderTime][day] += order.total_price;
        }
    });

    return Object.entries(weeklySales).map(([time, data]) => ({ time, ...data }));
};

export async function GET(req: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const dateRange = searchParams.get("dateRange");

        if (!dateRange) {
            return NextResponse.json({ error: "Date range is required" }, { status: 400 });
        }

        const weeklyReport = await getWeeklySalesData(dateRange);
        return NextResponse.json({ data: weeklyReport }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
