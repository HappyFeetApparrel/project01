import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

import { OrderItem } from "@/app/(main)/sales-orders/components/place-order-dialog";

const getOrdersData = async (period: string) => {
  const orders = await prisma.orderItem.findMany({
    include: {
      product: {
        include: {
          category: true,
          brand: true,
        },
      },
      order: true,
    },
    orderBy: {
      order_id: "desc", // Sort by id in descending order
    },
  });

  const formattedOrders = orders.flatMap((item) => ({
    id: item.order_id,
    order_item_id: item.order_item_id,
    productImage: item.product.product_image,
    productName: item.product.name,
    orderCode: item.order.order_code,
    category: item.product.category?.name || "Uncategorized",
    quantity: item.quantity,
    totalPrice: item.total_price,
    brand: item.product.brand?.name || "Unknown Brand",
    status: item.product.status,
  }));

  return formattedOrders;
};
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Retrieve the "period" query parameter from the request
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "7days"; // Default to 7days if no period is provided

    const ordersReport = await getOrdersData(period);

    return NextResponse.json({ data: ordersReport }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
