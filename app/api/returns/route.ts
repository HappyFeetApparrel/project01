import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const returns = await prisma.return.findMany({
      include: {
        product: {
          select: { name: true },
        },
        order: {
          select: { order_code: true },
        },
      },
      orderBy: {
        created_at: "desc", // Sort by latest
      },
    });

    const formattedReturns = returns.map((ret) => ({
      name: ret.order_id ? ret.order?.order_code : ret.product?.name, // Order code if order return, else product name
      type: ret.order_id ? "order" : "product",
      quantity: ret.quantity,
      reason: ret.reason,
      return_id: ret.return_id,
      product_id: ret.product_id,
      order_item_id: ret.order_id,
    }));

    return NextResponse.json({ data: formattedReturns }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();
    const { user_id, id, type, quantity, reason, otherReason } = data;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }
    if (!id) {
      return NextResponse.json(
        { error: "Product ID or Order ID is required." },
        { status: 400 }
      );
    }
    if (!reason) {
      return NextResponse.json(
        { error: "Reason is required." },
        { status: 400 }
      );
    }
    if (!type) {
      return NextResponse.json({ error: "Type is required." }, { status: 400 });
    }
    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than 0." },
        { status: 400 }
      );
    }

    let product_id: number | null = null;
    let unit_price: number | undefined = 0;

    if (type === "order") {
      // Fetch order item details using order_id (passed as id)
      const orderItem = await prisma.orderItem.findFirst({
        where: { order_id: id },
        select: { product_id: true, quantity: true, unit_price: true },
      });

      if (!orderItem) {
        return NextResponse.json(
          { error: "No product found for this order." },
          { status: 404 }
        );
      }

      unit_price = orderItem.unit_price;
      product_id = orderItem.product_id;

      // Check that the total returned quantity does not exceed the ordered quantity
      const previousReturns = await prisma.return.aggregate({
        where: { order_id: id },
        _sum: { quantity: true },
      });
      const totalReturned = (previousReturns._sum.quantity || 0) + quantity;
      if (totalReturned > orderItem.quantity) {
        return NextResponse.json(
          { error: "Return quantity exceeds the ordered quantity." },
          { status: 400 }
        );
      }
    } else {
      // For "product" type returns, the id represents the product_id
      product_id = id;
      const product = await prisma.product.findUnique({
        where: { product_id: id },
        select: { quantity_in_stock: true },
      });
      if (!product) {
        return NextResponse.json(
          { error: "Product not found." },
          { status: 404 }
        );
      }
      if (quantity > product.quantity_in_stock) {
        return NextResponse.json(
          { error: "Return quantity exceeds available stock." },
          { status: 400 }
        );
      }
    }

    // Use the otherReason if provided and applicable to the "Other" option
    const returnReason =
      reason === "Other" && otherReason ? otherReason : reason;

    // Create a new return record following the Returns type definition
    const newReturn = await prisma.return.create({
      data: {
        order_id: type === "order" ? id : null,
        product_id: type === "product" ? id : null,
        quantity,
        reason: returnReason,
        processed_by_id: user_id, // updated field name to match type
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Adjust the product's stock based on the return type
    if (product_id) {
      if (type === "order") {
        // For order returns, restore product stock
        await prisma.product.update({
          where: { product_id },
          data: { quantity_in_stock: { increment: quantity } },
        });
      } else {
        // For product returns, reduce the product stock
        await prisma.product.update({
          where: { product_id },
          data: { quantity_in_stock: { decrement: quantity } },
        });
      }
    }

    // If the reason is "Replace" and unit_price is available, trigger a redirect
    if (reason === "Replace" && unit_price) {
      return NextResponse.json(
        {
          data: {
            redirect_url:
              process.env.NEXT_PUBLIC_BASE_URL +
              `/sales-orders?price=${unit_price * quantity}&status=swap`,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ data: newReturn }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
