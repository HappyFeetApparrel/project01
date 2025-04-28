import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const categories = await prisma.brand.findMany({
      orderBy: {
        brand_id: "desc", // Adjust this to the appropriate timestamp field (e.g., "updatedAt")
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

    // Create a new brand in the database
    const newBrand = await prisma.brand.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json({ data: newBrand }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Update an existing brand
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();

    // Ensure the brand ID is provided
    if (!data.brand_id) {
      return NextResponse.json(
        { error: "Brand ID is required" },
        { status: 400 }
      );
    }

    const updatedBrand = await prisma.brand.update({
      where: {
        brand_id: data.brand_id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json({ data: updatedBrand }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Delete a brand
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();

    // Ensure the brand ID is provided
    if (!data.brand_id) {
      return NextResponse.json(
        { error: "Brand ID is required" },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: {
        brand_id: data.brand_id,
      },
    });

    return NextResponse.json(
      { message: "Brand deleted successfully" },
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
