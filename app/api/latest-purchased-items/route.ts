import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Your Prisma client instance

export async function GET(): Promise<NextResponse> {
  try {
    // Fetch the latest 10 orders (adjustable based on preference)
    const latestOrders = await prisma.salesOrder.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
      select: {
        order_id: true,
        order_items: {
          select: {
            product_id: true,
          },
        },
      },
    });

    // return NextResponse.json({ data: latestOrders }, { status: 200 });

    // Extract unique product IDs from these latest orders
    const productIds = [
      ...new Set(
        latestOrders.flatMap((order) =>
          order.order_items.map((item) => item.product_id)
        )
      ),
    ];

    // Fetch product details for the latest purchased products
    const latestPurchasedProducts = await prisma.product.findMany({
      where: {
        product_id: { in: productIds },
      },
      select: {
        product_id: true,
        name: true,
        product_image: true,
      },
    });

    // Format response data
    const responseData = latestPurchasedProducts.map((product) => ({
      id: product.product_id,
      name: product.name,
      image: product.product_image || "/placeholder.svg?height=40&width=40", // Default image if none exists
    }));

    return NextResponse.json({ data: responseData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
