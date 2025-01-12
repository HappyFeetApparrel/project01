import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to get user activity data
const getUserActivityData = async () => {
    const users = await prisma.user.findMany({
        include: {
            orders: {
                include: {
                    order_items: true, // Include order items for each order
                },
            },
            adjustments: true,
            logs: true,
        },
    });

    // Format the data into ActivityItem array
    const activities = users.map((user, index) => {
        // Calculate how long ago the user last performed an activity (for simplicity, using logs' created_at)
        const latestLog = user.logs.length > 0 ? user.logs[0].created_at : user.created_at;
        const timeAgo = calculateTimeAgo(latestLog);

        // Generate a random image URL using the Picsum API
        const randomSeed = Math.random().toString(36).substring(2, 8);
        const avatar = `https://picsum.photos/seed/${randomSeed}/40/40`;

        return {
            id: index + 1,
            name: user.name,
            avatar: avatar, // Random avatar image from Picsum
            products: user.orders.reduce((total, order) => total + order.order_items.length, 0), // Sum of products across all orders
            timeAgo,
            latestLog, // Add the latestLog for sorting purposes
        };
    });

    // Sort by latest activity
    const sortedActivities = activities.sort((a, b) => b.latestLog.getTime() - a.latestLog.getTime());

    // Return only the first 5 activities
    return sortedActivities.slice(0, 5);
};

// Helper function to calculate the time ago
const calculateTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

// API handler
export async function GET(): Promise<NextResponse> {
    try {
        const activities = await getUserActivityData();
        return NextResponse.json({ data: activities }, { status: 200 });
    } catch (error) {
        console.log('Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
