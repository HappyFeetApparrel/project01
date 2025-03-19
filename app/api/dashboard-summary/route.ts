import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { VscGraphLine } from "react-icons/vsc";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiDollar } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";

// Helper function to format amounts
const formatAmount = (amount: number) => {
    return amount > 1000 ? `${(amount / 1000).toFixed(1)}k` : `${amount}`;
};

export async function GET() {
    try {
        // Get the total number of orders, revenue, and customers
        const totalOrders = await prisma.salesOrder.count();
        const totalRevenue = await prisma.salesOrder.aggregate({
            _sum: {
                total_price: true,
            },
        });
        const totalSuppliers = await prisma.supplier.count();
        const totalProducts = await prisma.product.count();

        // Prepare the response data
        const data = [
            {
                icon: VscGraphLine,
                iconColorBG: "bg-cyan-50",
                iconColor: "text-cyan-500",
                amount: formatAmount(totalOrders),
                title: `Total Order${totalOrders > 0 ? 's' : ''}`,
            },
            {
                icon: CiDollar,
                iconColorBG: "bg-orange-50",
                iconColor: "text-orange-500",
                amount: `${formatAmount(totalProducts)}`, // Page Views with random value
                title: `Total Product${totalProducts > 0 ? 's' : ''}`,
            },
            {
                icon: IoBagOutline,
                iconColorBG: "bg-red-50",
                iconColor: "text-red-500",
                amount: formatAmount(totalSuppliers),
                title: `Total Supplier${totalSuppliers > 0 ? 's' : ''}`,
            },
            {
                icon: FaRegCalendarAlt,
                iconColorBG: "bg-violet-50",
                iconColor: "text-violet-500",
                amount: `₱ ${formatAmount(totalRevenue?._sum?.total_price ?? 0)}`,
                title: "Revenue",
            }
        ];

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
