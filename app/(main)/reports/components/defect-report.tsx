import React, { useState, useEffect } from "react";
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

// Define months for consistent display
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DefectSalesReport = () => {
  const [loadingSales, setLoadingSales] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [errorSales, setErrorSales] = useState("");

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const { data } = await api.get(
          "/product-returns-report?startDate=2025-01-01&endDate=2025-12-31"
        );

        // Create a default object for all months with values set to 0
        const defaultData = months.map((month) => ({
          month,
          lost: 0,
          return: 0,
          refund: 0,
          other: 0,
        }));

        // Map API response into the default data structure
        data.data.forEach((item: any) => {
          const date = new Date(item.date);
          const monthIndex = date.getMonth(); // 0-based index (Jan = 0, Dec = 11)
          defaultData[monthIndex] = {
            month: months[monthIndex], 
            lost: item.lost || 0,
            return: item.return || 0,
            refund: item.refund || 0,
            other: item.other || 0,
          };
        });

        setSalesData(defaultData);
      } catch (error) {
        setErrorSales("Failed to fetch sales report");
      } finally {
        setLoadingSales(false);
      }
    };

    fetchSalesReport();
  }, []);

  return (
    <div className="space-y-4 p-8 bg-white">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Defect Sales Report</h2>
        <div className="flex items-center gap-6 flex-wrap">
          <Legend color="#00A3FF" label="Lost" />
          <Legend color="#9747FF" label="Return" />
          <Legend color="#E93BF9" label="Refund" />
          <Legend color="#FF5733" label="Other" />
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-[400px] w-full">
        {loadingSales ? (
          <div className="h-full w-full flex justify-center items-center">
            <Skeleton className="w-full h-[350px]" />
          </div>
        ) : errorSales ? (
          <p className="text-red-500">{errorSales}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Line type="monotone" dataKey="lost" stroke="#00A3FF" strokeWidth={2} />
              <Line type="monotone" dataKey="return" stroke="#9747FF" strokeWidth={2} />
              <Line type="monotone" dataKey="refund" stroke="#E93BF9" strokeWidth={2} />
              <Line type="monotone" dataKey="other" stroke="#FF5733" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// Legend Component for Readability
const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

export default DefectSalesReport;
