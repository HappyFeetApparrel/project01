import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const getMonthlySalesData = async () => {
    const sales = await prisma.salesOrder.findMany({
        include: {
            order_items: {
                include: {
                    product: true,
                },
            },
            payment_method: true, // Include payment_method relation
        },
    });

    const monthlySales: Record<string, { directSales: number; retail: number; wholesale: number }> = {
        Jan: { directSales: 0, retail: 0, wholesale: 0 },
        Feb: { directSales: 0, retail: 0, wholesale: 0 },
        Mar: { directSales: 0, retail: 0, wholesale: 0 },
        Apr: { directSales: 0, retail: 0, wholesale: 0 },
        May: { directSales: 0, retail: 0, wholesale: 0 },
        Jun: { directSales: 0, retail: 0, wholesale: 0 },
        Jul: { directSales: 0, retail: 0, wholesale: 0 },
        Aug: { directSales: 0, retail: 0, wholesale: 0 },
        Sep: { directSales: 0, retail: 0, wholesale: 0 },
        Oct: { directSales: 0, retail: 0, wholesale: 0 },
        Nov: { directSales: 0, retail: 0, wholesale: 0 },
        Dec: { directSales: 0, retail: 0, wholesale: 0 },
    };

    sales.forEach((order) => {
        const month = order.created_at.toLocaleString('default', { month: 'short' });
        const category = order.payment_method?.name.toLowerCase();

        let salesType: 'directSales' | 'retail' | 'wholesale' = 'directSales';
        if (category === 'retail') salesType = 'retail';
        else if (category === 'wholesale') salesType = 'wholesale';

        monthlySales[month][salesType] += order.total_price;
    });

    return Object.entries(monthlySales).map(([month, data]) => ({ month, ...data }));
};

export async function GET(): Promise<NextResponse> {
    try {
        const salesReport = await getMonthlySalesData();
        console.log('Stock Data with All Months Having Data:', salesReport);
        return NextResponse.json({ data: salesReport }, { status: 200 });
    } catch (error) {
        console.log('Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
