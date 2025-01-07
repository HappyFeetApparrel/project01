import { NextResponse } from "next/server";


import prisma from "@/lib/prisma";


export async function GET(): Promise<NextResponse> {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: {
                supplier_id: "desc", // Adjust this to the appropriate timestamp field (e.g., "updatedAt")
            },
        });

        console.log('Suppliers:', suppliers);
        return NextResponse.json({ data: suppliers }, { status: 200 });
    } catch (error) {
        console.log('Error:', error);
        return NextResponse.json({ error: (error as Error) }, { status: 500 });
    }
}


export async function POST(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();

        // Create a new supplier in the database
        const newSupplier = await prisma.supplier.create({
            data: {
                name: data.name,
                contact_person: data.contact_person,
                phone_number: data.phone_number,
                email_address: data.email_address,
                address: data.address,
                supplied_products: data.supplied_products,
            },
        });

        return NextResponse.json({ data: newSupplier }, { status: 201 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// Update an existing supplier
export async function PUT(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();

        // Ensure the supplier ID is provided
        if (!data.supplier_id) {
            return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
        }

        const updatedSupplier = await prisma.supplier.update({
            where: {
                supplier_id: data.supplier_id,
            },
            data: {
                name: data.name,
                contact_person: data.contact_person,
                phone_number: data.phone_number,
                email_address: data.email_address,
                address: data.address,
                supplied_products: data.supplied_products,
            },
        });

        return NextResponse.json({ data: updatedSupplier }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// Delete a supplier
export async function DELETE(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();

        // Ensure the supplier ID is provided
        if (!data.supplier_id) {
            return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
        }

        await prisma.supplier.delete({
            where: {
                supplier_id: data.supplier_id,
            },
        });

        return NextResponse.json({ message: "Supplier deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}