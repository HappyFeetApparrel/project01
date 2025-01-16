"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (error) return <div>{error}</div>;

  return (
    <Card className="w-full m-0 xl:my-8 xl:max-w-sm max-w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!loading && activities.length > 0
          ? activities.map((activity) => (
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
            ))
          : Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                  <Skeleton className="w-10 h-10 " />
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
