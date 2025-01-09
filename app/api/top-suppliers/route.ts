import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
    try {
        // Predefined colors
        const colors = ["#00A3FF", "#E91E63", "#4CAF50", "#9C27B0", "#FF5722"];

        // Fetch suppliers and their related products
        const suppliers = await prisma.supplier.findMany({
            include: {
                products: true, // Include related products to calculate the value
            },
        });

        // Map and calculate the total stock value for each supplier
        const supplierData = suppliers.map((supplier) => {
            const totalStockValue = supplier.products.reduce((total, product) => {
                return total + product.quantity_in_stock * product.cost_price;
            }, 0);

            return {
                name: supplier.name,
                value: totalStockValue, // Stock value
            };
        });

        // Sort by value in descending order and take the top 5
        const topSuppliers = supplierData
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map((supplier, index) => ({
                ...supplier,
                color: colors[index], // Assign predefined colors sequentially
            }));

        return NextResponse.json({ data: topSuppliers }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
