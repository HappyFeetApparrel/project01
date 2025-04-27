import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const returns = await prisma.productReturn.findMany({
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
    const { user_id, id, type, reason, otherReason, quantity } = data;

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

    if (!quantity) {
      return NextResponse.json(
        { error: "Quantity is required." },
        { status: 400 }
      );
    }

    let product_id: number | null = null;
    let unit_price: number | undefined = 0;
    if (type === "order") {
      // Fetch product_id related to the order
      const orderItem = await prisma.orderItem.findFirst({
        where: { order_id: id },
        select: { product_id: true, quantity: true, unit_price: true },
      });
      unit_price = orderItem?.unit_price;

      if (!orderItem) {
        return NextResponse.json(
          { error: "No product found for this order." },
          { status: 404 }
        );
      }

      product_id = orderItem.product_id;

      // Check if total returned quantity will exceed the ordered quantity
      const previousReturns = await prisma.productReturn.aggregate({
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
      // Directly use product_id if returning to supplier
      product_id = id;

      // Get current stock
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

    const returnReason = reason === "Other" ? otherReason : reason;

    const productReturn = await prisma.productReturn.create({
      data: {
        order_id: type === "order" ? id : null,
        product_id: type === "product" ? id : null,
        quantity: quantity,
        reason: returnReason,
        processed_by_user_id: user_id,
        updated_at: new Date(), // Add this line
      },
    });

    // Adjust product quantity based on return type
    if (product_id) {
      if (type === "order") {
        // If order return, restore product stock
        await prisma.product.update({
          where: { product_id },
          data: { quantity_in_stock: { increment: quantity } }, // Increase stock
        });
      } else if (type === "product") {
        // If returning product to supplier, reduce product stock
        await prisma.product.update({
          where: { product_id },
          data: { quantity_in_stock: { decrement: quantity } }, // Decrease stock
        });
      }
    }

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

    return NextResponse.json({ data: productReturn }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();
    const { return_id, user_id, quantity, reason, otherReason } = data;

    if (!return_id) {
      return NextResponse.json(
        { error: "Return ID is required." },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (!quantity) {
      return NextResponse.json(
        { error: "Quantity is required." },
        { status: 400 }
      );
    }

    // Fetch the existing return record
    const existingReturn = await prisma.productReturn.findUnique({
      where: { return_id },
      include: { product: true, order: true },
    });

    if (!existingReturn) {
      return NextResponse.json(
        { error: "Product return not found." },
        { status: 404 }
      );
    }

    let product_id = existingReturn.product_id;
    let type = existingReturn.order_id ? "order" : "product";

    // Calculate stock adjustment
    const quantityDifference = quantity - existingReturn.quantity;

    if (product_id) {
      if (type === "order") {
        // Adjust stock based on difference
        await prisma.product.update({
          where: { product_id },
          data: { quantity_in_stock: { increment: quantityDifference } },
        });
      } else if (type === "product") {
        // Returning to supplier, reverse logic
        await prisma.product.update({
          where: { product_id },
          data: { quantity_in_stock: { decrement: quantityDifference } },
        });
      }
    }

    // Update the product return record
    const updatedReturn = await prisma.productReturn.update({
      where: { return_id },
      data: {
        quantity,
        reason: reason === "Other" ? otherReason : reason,
        processed_by_user_id: user_id,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ data: updatedReturn }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();
    const { return_id } = data;

    if (!return_id) {
      return NextResponse.json(
        { error: "Return ID is required." },
        { status: 400 }
      );
    }

    // Fetch the return details first
    const productReturn = await prisma.productReturn.findUnique({
      where: { return_id },
      include: { product: true, order: true }, // Include related data
    });

    if (!productReturn) {
      return NextResponse.json(
        { error: "Product return not found." },
        { status: 404 }
      );
    }

    // Reverse stock adjustment before deleting the record
    if (productReturn.product_id) {
      await prisma.product.update({
        where: { product_id: productReturn.product_id },
        data: { quantity_in_stock: { decrement: productReturn.quantity } }, // Decrease stock back
      });
    }

    // Delete the product return record
    await prisma.productReturn.delete({
      where: { return_id },
    });

    return NextResponse.json(
      { message: "Product return deleted, and stock reverted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
