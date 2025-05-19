import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc", // Sort by name in ascending order (A-Z)
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

    // Create a new category in the database
    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json({ data: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Update an existing category
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();

    // Ensure the category ID is provided
    if (!data.category_id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: {
        category_id: data.category_id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json({ data: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Delete a category
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json();

    // Ensure the category ID is provided
    if (!data.category_id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: {
        category_id: data.category_id,
      },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
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
