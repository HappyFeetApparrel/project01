import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

import { OrderItem } from "@/app/(main)/sales-orders/components/place-order-dialog";

// Helper function to filter orders based on the selected period
const filterOrdersByPeriod = (period: string) => {
  const now = new Date();
  let startDate: Date;

  // Create a new date instance to avoid modifying the original now
  switch (period) {
    case "7days":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7); // Last 7 days
      break;
    case "30days":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30); // Last 30 days
      break;
    case "90days":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 90); // Last 90 days
      break;
    default:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7); // Default to 7 days
  }

  return startDate;
};

const getOrdersData = async (period: string) => {
  const startDate = filterOrdersByPeriod(period);

  const orders = await prisma.salesOrder.findMany({
    where: {
      created_at: {
        gte: startDate, // Filter orders by the selected period
      },
    },
    include: {
      order_items: {
        include: {
          product: {
            include: {
              category: true,
              brand: true,
            },
          },
        },
      },
    },
    orderBy: {
      order_id: "desc", // Sort by id in descending order
    },
  });

  const formattedOrders = orders.flatMap((order) =>
    order.order_items.map((item) => ({
      id: item.order_id,
      order_item_id: item.order_item_id,
      productImage: item.product.product_image,
      productName: item.product.name,
      orderCode: order.order_code,
      category: item.product.category?.name || "Uncategorized",
      quantity: item.quantity,
      totalPrice: item.total_price,
      brand: item.product.brand?.name || "Unknown Brand",
      status: item.product.status,
    }))
  );

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

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();

    // Generate a unique order code with a hexadecimal identifier
    const orderCode = `ORD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // Create a new SalesOrder
    const salesOrder = await prisma.salesOrder.create({
      data: {
        order_code: orderCode,
        user_id: data.user_id, // Ensure this is passed in the request
        payment_method_id: data.paymentMethod,
        amount_given: data.amountGiven,
        change: data.change,
        total_price: data.totalAmount,
        discountPercentage: data.discountPercentage,
        discountedTotal: data.discountedTotal,
      },
    });

    // Insert Order Items
    await Promise.all(
      data.items.map(async (item: OrderItem) => {
        return prisma.orderItem.create({
          data: {
            order_id: salesOrder.order_id,
            product_id: item.product.product_id,
            quantity: item.quantity_in_stock,
            unit_price: item.product.unit_price,
            total_price: item.product.unit_price * item.quantity_in_stock,
          },
        });
      })
    );

    // Adjust inventory stock
    await Promise.all(
      data.items.map(async (item: OrderItem) => {
        await prisma.inventoryAdjustment.create({
          data: {
            product_id: item.product.product_id,
            quantity_changed: -item.quantity_in_stock,
            reason: "Order Purchase",
            adjusted_by: data.user_id, // Ensure this is passed in the request
          },
        });

        // Reduce stock in Product table
        await prisma.product.update({
          where: { product_id: item.product.product_id },
          data: {
            quantity_in_stock: {
              decrement: item.quantity_in_stock,
            },
          },
        });
      })
    );

    return NextResponse.json(
      { order: salesOrder, orderCode: orderCode },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error as Error }, { status: 500 });
  }
}
