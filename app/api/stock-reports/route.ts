import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

// Fisher-Yates shuffle function
export async function GET(): Promise<NextResponse> {
  try {
    const stockData = await prisma.inventoryAdjustment.groupBy({
      by: ["created_at"],
      _sum: {
        quantity_changed: true,
      },
    });

    // Initialize the monthly data with all months having 0 stockIn and stockOut
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      stockIn: 0,
      stockOut: 0,
    }));

    // Populate the monthlyData with actual values from stockData
    stockData.forEach(({ created_at, _sum }) => {
      const monthIndex = new Date(created_at).getMonth();
      const quantityChanged = _sum?.quantity_changed;
      if (quantityChanged !== null) {
        if (quantityChanged > 0) {
          monthlyData[monthIndex].stockIn += quantityChanged;
        } else {
          monthlyData[monthIndex].stockOut += Math.abs(quantityChanged);
        }
      }
    });

    return NextResponse.json({ data: monthlyData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error as Error }, { status: 500 });
  }
}
