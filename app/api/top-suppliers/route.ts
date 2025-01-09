import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
    try {
        // Fetch the top 5 suppliers based on the total value of products in stock
        const topSuppliers = await prisma.supplier.findMany({
            take: 5,
            include: {
                products: true, // Include related products
            },
        });
        return NextResponse.json({ data: topSuppliers }, { status: 200 });

        // Calculate total stock value and sort suppliers
        const supplierData = topSuppliers
            .map((supplier) => {
                const totalStockValue = supplier.products.reduce((total, product) => {
                    return total + product.quantity_in_stock * product.cost_price;
                }, 0);

                return {
                    supplier_id: supplier.supplier_id,
                    name: supplier.name,
                    contact_person: supplier.contact_person,
                    phone_number: supplier.phone_number,
                    email_address: supplier.email_address,
                    address: supplier.address,
                    supplied_products: supplier.supplied_products,
                    total_stock_value: totalStockValue,
                    total_products: supplier.products.length, // Number of products
                };
            })
            .sort((a, b) => b.total_stock_value - a.total_stock_value) // Sort by stock value (descending)
            .slice(0, 5); // Take the top 5 suppliers

        return NextResponse.json({ data: supplierData }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
