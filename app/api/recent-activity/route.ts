import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

// Helper function to fetch user activity data
const getUserActivityData = async () => {
    const activities = await prisma.userActivityLog.findMany({
        include: {
            user: true, // Fetch user details
        },
        orderBy: {
            created_at: "desc", // Get the latest activities first
        },
        take: 5, // Limit to 5 recent activities
    });

    // Format the data into an ActivityItem array
    return activities.map((activity, index) => {
        const timeAgo = formatDistanceToNow(new Date(activity.created_at), { addSuffix: true });

        // Generate a random avatar image using Picsum
        const randomSeed = Math.random().toString(36).substring(2, 8);
        const avatar = `https://picsum.photos/seed/${randomSeed}/40/40`;

        return {
            id: index + 1,
            user_id: activity.user_id,
            name: activity.user?.name || "Unknown User",
            avatar,
            action: activity.action,
            details: activity.details,
            timeAgo,
        };
    });
};

// API handler to get recent activities
export async function GET(): Promise<NextResponse> {
    try {
        const activities = await getUserActivityData();
        return NextResponse.json({ data: activities }, { status: 201 });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ error: "Error fetching activities." }, { status: 500 });
    }
}



// API handler to save activity
export async function POST(request: Request): Promise<NextResponse> {
    try {
        // Extract data from the request body
        const { user_id, action, details } = await request.json();

        // Check if the required data is provided
        if (!user_id || !action || !details) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // Save the activity log to the database
        await prisma.userActivityLog.create({
            data: {
                user_id: user_id,
                action,
                details,
            },
        });

        // Return a success response
        return NextResponse.json({ message: "Activity saved successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error saving activity:", error);
        return NextResponse.json({ error: "Error saving activity." }, { status: 500 });
    }
}