import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to filter orders based on the selected period
const filterOrdersByPeriod = (period: string) => {
    const now = new Date();
    let startDate: Date;

    // Create a new date instance to avoid modifying the original now
    switch (period) {
        case "7days":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7); // Last 7 days
            break;
        case "30days":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 30); // Last 30 days
            break;
        case "90days":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 90); // Last 90 days
            break;
        default:
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7); // Default to 7 days
    }

    return startDate;
};

const getOrdersData = async (period: string) => {
    const startDate = filterOrdersByPeriod(period);

    const orders = await prisma.salesOrder.findMany({
        where: {
            created_at: {
                gte: startDate, // Filter orders by the selected period
            },
        },
        include: {
            order_items: {
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
    });

    const formattedOrders = orders.flatMap((order) =>
        order.order_items.map((item) => ({
            id: item.order_item_id,
            productImage: item.product.product_image,
            productName: item.product.name,
            orderCode: order.order_code,
            category: item.product.category?.name || "Uncategorized",
            quantity: item.quantity,
            totalPrice: item.total_price,
        }))
    );

    return formattedOrders;
};

export async function GET(request: Request): Promise<NextResponse> {
    try {
        // Retrieve the "period" query parameter from the request
        const url = new URL(request.url);
        const period = url.searchParams.get("period") || "7days"; // Default to 7days if no period is provided

        const ordersReport = await getOrdersData(period);

        return NextResponse.json({ data: ordersReport }, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
