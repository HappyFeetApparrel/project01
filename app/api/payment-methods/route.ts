import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const categories = await prisma.paymentMethod.findMany({
      orderBy: {
        payment_method_id: "desc", // Adjust this to the appropriate timestamp field (e.g., "updatedAt")
      },
    });

    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error as Error }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();

    // Create a new paymentMethod in the database
    const newPaymentMethod = await prisma.paymentMethod.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json({ data: newPaymentMethod }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Update an existing paymentMethod
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();

    // Ensure the paymentMethod ID is provided
    if (!data.payment_method_id) {
      return NextResponse.json(
        { error: "PaymentMethod ID is required" },
        { status: 400 }
      );
    }

    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: {
        payment_method_id: data.payment_method_id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json({ data: updatedPaymentMethod }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Delete a paymentMethod
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();

    // Ensure the paymentMethod ID is provided
    if (!data.payment_method_id) {
      return NextResponse.json(
        { error: "PaymentMethod ID is required" },
        { status: 400 }
      );
    }

    await prisma.paymentMethod.delete({
      where: {
        payment_method_id: data.payment_method_id,
      },
    });

    return NextResponse.json(
      { message: "PaymentMethod deleted successfully" },
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
