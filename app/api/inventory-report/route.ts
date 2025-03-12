import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        name: true,
        category: { select: { name: true } },
        quantity_in_stock: true,
        unit_price: true,
        status: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch  {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
