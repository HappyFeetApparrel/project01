import { NextResponse } from "next/server";


import prisma from "@/lib/prisma";


export async function GET(): Promise<NextResponse> {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                product_id: "desc", // Adjust this to the appropriate timestamp field (e.g., "updatedAt")
            },
            include: {
                brand: true,
                category: true,
                supplier: true,
            },
        });
        return NextResponse.json({ data: products }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}


export async function POST(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();

        // Create a new product in the database
        await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                category_id: data.category_id,
                quantity_in_stock: data.quantity_in_stock,
                unit_price: data.unit_price,
                cost_price: data.cost_price,
                supplier_id: data.supplier_id,
                date_of_entry: data.date_of_entry,
                size: data.size,
                color: data.color,
                product_image: data.product_image,
                brand_id: data.brand_id,
                expiration_date: data.expiration_date,
                status: data.status,
                discount: data.discount,
            },
        });

        return NextResponse.json({ message: "New Product Created Successfully!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error) }, { status: 500 });
    }
}



// Update an existing product
export async function PUT(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();

        // Ensure the product ID is provided
        if (!data.product_id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const updatedSupplier = await prisma.product.update({
            where: {
                product_id: data.product_id,
            },
            data: {
                name: data.name,
                description: data.description,
                category_id: data.category_id,
                quantity_in_stock: data.quantity_in_stock,
                unit_price: data.unit_price,
                cost_price: data.cost_price,
                supplier_id: data.supplier_id,
                date_of_entry: data.date_of_entry,
                size: data.size,
                color: data.color,
                product_image: data.product_image,
                brand_id: data.brand_id,
                expiration_date: data.expiration_date,
                status: data.status,
                discount: data.discount,
            },
        });

        return NextResponse.json({ data: updatedSupplier }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// Delete a product
export async function DELETE(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();

        // Ensure the product ID is provided
        if (!data.product_id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        await prisma.product.delete({
            where: {
                product_id: data.product_id,
            },
        });

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error) }, { status: 500 });
    }
}