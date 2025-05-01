import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseISO, format, getMonth, isWithinInterval } from "date-fns";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start and end dates are required" },
        { status: 400 }
      );
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Fetch all product returns within the date range
    const productReturns = await prisma.return.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
      select: {
        created_at: true,
        quantity: true,
        reason: true,
      },
    });

    // Initialize monthly buckets
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(2025, i, 1), "MMM"), // You can change 2025 to dynamic year
      lost: 0,
      return: 0,
      refund: 0,
      other: 0,
    }));

    // Populate months with actual return data
    for (const entry of productReturns) {
      const monthIndex = getMonth(entry.created_at);
      const quantity = entry.quantity || 0;

      const reason = entry.reason?.toLowerCase();
      if (reason === "lost") {
        months[monthIndex].lost += quantity;
      } else if (reason === "return") {
        months[monthIndex].return += quantity;
      } else if (reason === "refund") {
        months[monthIndex].refund += quantity;
      } else {
        months[monthIndex].other += quantity;
      }
    }

    // Filter only months within the selected range (optional)
    const filteredMonths = months.filter((_, idx) => {
      const currentMonthDate = new Date(start.getFullYear(), idx, 1);
      return isWithinInterval(currentMonthDate, { start, end });
    });

    return NextResponse.json({ data: filteredMonths }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
