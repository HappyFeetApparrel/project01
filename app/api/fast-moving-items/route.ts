import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Your Prisma client instance

export async function GET(): Promise<NextResponse> {
    try {
        // Fetch products with their total quantity sold or adjusted
        const salesData = await prisma.orderItem.groupBy({
            by: ["product_id"],
            _sum: {
                quantity: true,
            },
        });

        const adjustmentData = await prisma.inventoryAdjustment.groupBy({
            by: ["product_id"],
            _sum: {
                quantity_changed: true,
            },
        });

        // Create a map to track the total sales and adjustments for each product
        const productMap: { [key: number]: { sales: number; adjustments: number } } = {};

        salesData.forEach(({ product_id, _sum }) => {
            productMap[product_id] = { ...productMap[product_id], sales: _sum.quantity || 0 };
        });

        adjustmentData.forEach(({ product_id, _sum }) => {
            productMap[product_id] = { ...productMap[product_id], adjustments: _sum.quantity_changed || 0 };
        });

        // Define a threshold to classify fast-moving items, e.g., top 5 items with highest sales or adjustments
        const fastMovingItems = Object.keys(productMap)
            .map((productId) => {
                const product = productMap[Number(productId)];
                return {
                    product_id: Number(productId),
                    sales: product.sales,
                    adjustments: product.adjustments,
                    totalActivity: product.sales + Math.abs(product.adjustments), // You can adjust the calculation as needed
                };
            })
            .sort((a, b) => b.totalActivity - a.totalActivity) // Sort by total activity (sales + adjustments)
            .slice(0, 5); // Get top 5 fast-moving items

        // Fetch product details for the fast-moving items
        const fastMovingProductDetails = await prisma.product.findMany({
            where: {
                product_id: { in: fastMovingItems.map((item) => item.product_id) },
            },
            select: {
                product_id: true,
                name: true,
                product_image: true,
            },
        });

        // Map the fast-moving items to match the required response format
        const responseData = fastMovingProductDetails.map((product) => ({
            id: product.product_id,
            name: product.name,
            image: product.product_image || "/placeholder.svg?height=40&width=40", // Set default image if none exists
        }));

        return NextResponse.json({ data: responseData }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
