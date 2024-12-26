"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const data = [
  { month: "Jan", stockIn: 8500, stockOut: 6500 },
  { month: "Feb", stockIn: 6500, stockOut: 6000 },
  { month: "Mar", stockIn: 7000, stockOut: 8000 },
  { month: "Apr", stockIn: 8000, stockOut: 9500 },
  { month: "May", stockIn: 5000, stockOut: 4000 },
  { month: "Jun", stockIn: 5500, stockOut: 6000 },
  { month: "Jul", stockIn: 7500, stockOut: 6500 },
  { month: "Aug", stockIn: 10000, stockOut: 8500 },
  { month: "Sep", stockIn: 9500, stockOut: 7000 },
  { month: "Oct", stockIn: 7000, stockOut: 5000 },
  { month: "Nov", stockIn: 8000, stockOut: 6500 },
  { month: "Dec", stockIn: 6000, stockOut: 4500 },
];

export default function StockReports() {
  return (
    <div className="py-8 px-4 md:px-8 space-y-8 ">
      <Card className="w-full ">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 flex-wrap">
          <CardTitle className="text-2xl font-bold">Stock Report</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#2196F3] mr-2" />
              <span className="text-sm text-muted-foreground">Stock In</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#9C27B0] mr-2" />
              <span className="text-sm text-muted-foreground">Stock Out</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                />
                <Bar
                  dataKey="stockIn"
                  fill="#2196F3"
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="stockOut"
                  fill="#9C27B0"
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
