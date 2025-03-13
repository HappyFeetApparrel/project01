import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export async function GET(): Promise<NextResponse> {
    try {
        // Group sales data by product
        const salesByCategory = await prisma.orderItem.groupBy({
            by: ["product_id"],
            _sum: { total_price: true },
            _count: { order_item_id: true },
            orderBy: { _sum: { total_price: "desc" } },
        });

        const productIds = salesByCategory.map(item => item.product_id);

        // Fetch all required products in a single query
        const products = await prisma.product.findMany({
            where: { product_id: { in: productIds } },
            include: { category: true },
        });

        // Fetch all related order items with their orders
        const orderItems = await prisma.orderItem.findMany({
            where: { product_id: { in: productIds } },
            include: { order: true },
        });

        // Organize order items by product_id for fast lookup
        const orderItemsByProduct = orderItems.reduce((acc, item) => {
            if (!acc[item.product_id]) acc[item.product_id] = [];
            acc[item.product_id].push(item);
            return acc;
        }, {} as Record<number, typeof orderItems>);

        // Build response
        const formattedData = salesByCategory.map(item => {
            const product = products.find(p => p.product_id === item.product_id);

            // Aggregate sales by month
            const salesByMonth = (orderItemsByProduct[item.product_id] || []).reduce((acc, sale) => {
                if (sale.order?.created_at) {
                    const month = format(new Date(sale.order.created_at), "yyyy-MM");
                    acc[month] = (acc[month] || 0) + sale.total_price;
                }
                return acc;
            }, {} as Record<string, number>);

            return {
                category: product?.category?.name || "Uncategorized",
                totalSales: item._sum.total_price || 0,
                totalOrders: item._count.order_item_id || 0,
                salesData: Object.entries(salesByMonth).map(([month, totalSales]) => ({ month, totalSales })),
            };
        });

        return NextResponse.json({ data: formattedData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching sales by category:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
