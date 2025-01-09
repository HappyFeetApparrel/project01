"use client";

import React, { useEffect, useState } from "react";
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
import { api } from "@/lib/axios"; // Import the api from your axios configuration

export default function StockReports() {
  // State to store the fetched stock report data
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    // Fetch data on component mount
    const fetchStockData = async () => {
      try {
        const { data } = await api.get("/stock-reports"); // Replace with your actual endpoint
        setStockData(data.data); // Set the fetched data to state
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, []);

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
              {stockData && (
                <BarChart
                  data={stockData}
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
                    fill="#2196F3" // Stock In color
                    stackId="a"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="stockOut"
                    fill="#9C27B0" // Stock Out color
                    stackId="a"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
