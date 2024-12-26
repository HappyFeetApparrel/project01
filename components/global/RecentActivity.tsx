"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ActivityItem {
  id: number;
  name: string;
  avatar: string;
  products: number;
  timeAgo: string;
}

const activities: ActivityItem[] = [
  {
    id: 1,
    name: "Grace Moreta",
    avatar: "/placeholder.svg?height=40&width=40",
    products: 11,
    timeAgo: "1 m ago",
  },
  {
    id: 2,
    name: "Allison Siphron",
    avatar: "/placeholder.svg?height=40&width=40",
    products: 24,
    timeAgo: "12 m ago",
  },
  {
    id: 3,
    name: "Makenna Doman",
    avatar: "/placeholder.svg?height=40&width=40",
    products: 4,
    timeAgo: "23 m ago",
  },
  {
    id: 4,
    name: "Makenna Doman",
    avatar: "/placeholder.svg?height=40&width=40",
    products: 24,
    timeAgo: "42 m ago",
  },
  {
    id: 5,
    name: "Ahmad Vetrovs",
    avatar: "/placeholder.svg?height=40&width=40",
    products: 16,
    timeAgo: "2 h ago",
  },
];

export default function RecentActivity() {
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
