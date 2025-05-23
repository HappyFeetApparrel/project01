import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse, format, parseISO, startOfDay, endOfDay } from "date-fns";

// const parseDateRange = (dateRange: string) => {
//   try {
//     const [startPart, endPart] = dateRange.split("-");
//     const currentYear = new Date().getFullYear();

//     // Parse start date (e.g., "Aug 19")
//     const startDate = parse(
//       `${startPart.trim()} ${currentYear}`,
//       "MMM d yyyy",
//       new Date()
//     );

//     if (isNaN(startDate.getTime())) {
//       throw new Error("Invalid start date format.");
//     }

//     // Parse end day and set it for the same month as the start date
//     const endDay = parseInt(endPart.trim(), 10);
//     if (isNaN(endDay) || endDay < 1 || endDay > 31) {
//       throw new Error("Invalid end date format.");
//     }

//     const endDate = new Date(startDate);
//     endDate.setDate(endDay);

//     return {
//       startDate,
//       endDate,
//     };
//   } catch {
//     throw new Error("Invalid date range format. Use format like 'Aug 19-25'.");
//   }
// };

// const parseDateRange = (dateRange: string) => {
//   try {
//     const [startPart, endPart] = dateRange.split("-");
//     const currentYear = new Date().getFullYear();

//     // Parse start date (e.g., "Mar 31")
//     const startDate = parse(
//       `${startPart.trim()} ${currentYear}`,
//       "MMM d yyyy",
//       new Date()
//     );

//     if (isNaN(startDate.getTime())) {
//       throw new Error("Invalid start date format.");
//     }

//     // Parse end day
//     const endDay = parseInt(endPart.trim(), 10);
//     if (isNaN(endDay) || endDay < 1 || endDay > 31) {
//       throw new Error("Invalid end date format.");
//     }

//     // Set the end date explicitly for April
//     const endDate = new Date(startDate);
//     endDate.setMonth(3); // Set directly to April (0-indexed, 3 = April)
//     endDate.setDate(endDay);

//     // Use startOfDay and endOfDay to set the full range for the day
//     const startOfRange = startOfDay(startDate); // Start of the start date
//     const endOfRange = endOfDay(endDate); // End of the end date

//     return {
//       startDate: startOfRange,
//       endDate: endOfRange,
//     };
//   } catch {
//     throw new Error(
//       "Invalid date range format. Use format like 'Mar 31 - Apr 6'."
//     );
//   }
// };

const getWeeklySalesData = async (start: string, end: string) => {
  //   const { startDate, endDate } = parseDateRange(dateRange);

  const startDate = parseISO(start);
  const endDate = parseISO(end);

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
    "00:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "01:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "02:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "03:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "04:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "05:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "06:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "07:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "08:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "09:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "10:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "11:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "12:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "13:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "14:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "15:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "16:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "17:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "18:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "19:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "20:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "21:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "22:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    "23:00": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
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
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start) {
      return NextResponse.json(
        { error: "Start date is required" },
        { status: 400 }
      );
    }

    if (!end) {
      return NextResponse.json(
        { error: "End date is required" },
        { status: 400 }
      );
    }

    const weeklyReport = await getWeeklySalesData(start, end);
    return NextResponse.json({ data: weeklyReport }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
