import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseISO, format } from "date-fns";

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
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    const report = await prisma.return.groupBy({
      by: ["reason", "created_at"],
      _sum: {
        quantity: true,
      },
      where: {
        product_id: {
          not: null,
        },
      },
    });

    const returns = await prisma.return.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
      include: {
        order: {
          include: {
            user: true,
            order_items: {
              include: {
                product: true,
              },
            },
          },
        },
        product: true,
        processed_by: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    const itemizedData = returns.map((r) => ({
      sku: r.order?.order_code || `PROD-000${r.product_id?.toString() ?? "NA"}`,
      status: r.reason,
      date: r.created_at.toISOString().split("T")[0],
      name: r.processed_by?.name ?? "N/A",
      item_name:
        r.product?.name ??
        r.order?.order_items?.[0]?.product?.name ??
        "Unnamed Product",
    }));

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(2025, i, 1), "MMM"),
      lost: 0,
      return: 0,
      refund: 0,
      replace: 0,
      other: 0,
    }));

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
        case "Replace":
          months[monthIndex].replace += entry._sum.quantity || 0;
          break;
        default:
          months[monthIndex].other += entry._sum.quantity || 0;
          break;
      }
    });

    return NextResponse.json(
      {
        data: {
          months,
          returns: itemizedData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
