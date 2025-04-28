"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useLayout } from "../context/LayoutProvider";

import { UserActivityLogFormatted } from "@/prisma/type";

export default function RecentActivity() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<
    UserActivityLogFormatted[]
  >([]);

  const { activities } = useLayout();

  // Fetch user activity data
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setRecentActivities(activities);
        setLoading(false);
      } catch {
        setError("Failed to fetch activities.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [activities]);

  if (error) return <div>{error}</div>;

  return (
    <Card className="w-full m-0 xl:my-8 xl:max-w-sm max-w-full items-start">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!loading && recentActivities.length > 0
          ? activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 ">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">
                      {activity.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 flex-wrap">
                    <span className="text-sm">{activity.action}</span>
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
