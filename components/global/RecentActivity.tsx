"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

// Define the structure of ActivityItem
interface ActivityItem {
  id: number;
  name: string;
  avatar: string;
  products: number;
  timeAgo: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user activity data
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get("/recent-activity"); // Replace with actual endpoint
        setActivities(response.data.data);
      } catch {
        setError("Failed to fetch activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className="w-full m-0 xl:my-8 xl:max-w-sm max-w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Image
              src={activity.avatar}
              alt={`${activity.name}'s avatar`}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-700">Ordered</span>
                <span className="font-semibold text-[#00A3FF]">
                  {activity.products}
                </span>
                <span className="font-medium text-gray-700">Products</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">{activity.name}</span>
                <span className="text-sm text-muted-foreground">-</span>
                <span className="text-sm text-[#00A3FF]">
                  {activity.timeAgo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
