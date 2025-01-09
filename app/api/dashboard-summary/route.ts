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
        const totalCustomers = await prisma.user.count();

        // Random value for page views (if you don't have a pageView model)
        const randomPageViews = Math.floor(Math.random() * (100000 - 50000 + 1)) + 50000; // Random value between 50,000 and 100,000

        // Prepare the response data
        const data = [
            {
                icon: VscGraphLine,
                iconColorBG: "bg-cyan-50",
                iconColor: "text-cyan-500",
                amount: formatAmount(totalOrders),
                title: "Total Orders",
            },
            {
                icon: FaRegCalendarAlt,
                iconColorBG: "bg-violet-50",
                iconColor: "text-violet-500",
                amount: `$ ${formatAmount(totalRevenue?._sum?.total_price ?? 0)}`,
                title: "Revenue",
            },
            {
                icon: CiDollar,
                iconColorBG: "bg-orange-50",
                iconColor: "text-orange-500",
                amount: `$ ${formatAmount(randomPageViews)}`, // Page Views with random value
                title: "Page Views",
            },
            {
                icon: IoBagOutline,
                iconColorBG: "bg-red-50",
                iconColor: "text-red-500",
                amount: formatAmount(totalCustomers),
                title: "New Customers",
            },
        ];

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
