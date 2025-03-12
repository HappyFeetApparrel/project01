import React, {useState, useEffect} from 'react'

import { api } from "@/lib/axios";

import { Skeleton } from "@/components/ui/skeleton";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DefectSalesReport = () => {
    {/* Sales Report Section */}

      const [loadingSales, setLoadingSales] = useState(true);
        const [salesData, setSalesData] = useState([]);
        const [errorSales, setErrorSales] = useState("");
            



        useEffect(() => {
          const fetchSalesReport = async () => {
            try {
              const { data } = await api.get("/sales-report");
              setSalesData(data.data);
            } catch {
              setErrorSales("Failed to fetch sales report");
            } finally {
              setLoadingSales(false);
            }
          };
          fetchSalesReport();
        }, []);


  return (
    <div className="space-y-4 p-8 bg-white">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Defect Sales Report</h2>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#00A3FF]" />
          <span className="text-sm text-muted-foreground">
            Lost
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#9747FF]" />
          <span className="text-sm text-muted-foreground">Return</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#E93BF9]" />
          <span className="text-sm text-muted-foreground">Refund</span>
        </div>
      </div>
    </div>

    <div className="h-[400px] w-full">
      {loadingSales ? (
        <ResponsiveContainer width="100%" height="100%">
          <div className="h-full w-full flex justify-center items-center">
            <Skeleton className="w-full h-[350px]" />
          </div>
        </ResponsiveContainer>
      ) : errorSales ? (
        <p className="text-red-500">{errorSales}</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
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
              domain={[0, 25000]}
              ticks={[0, 5000, 10000, 15000, 20000, 25000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Line
              type="monotone"
              dataKey="directSales"
              stroke="#00A3FF"
              strokeWidth={2}
              dot={{ fill: "#00A3FF", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="retail"
              stroke="#9747FF"
              strokeWidth={2}
              dot={{ fill: "#9747FF", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="wholesale"
              stroke="#E93BF9"
              strokeWidth={2}
              dot={{ fill: "#E93BF9", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
  )
}

export default DefectSalesReport
