import React, { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parse, eachMonthOfInterval, startOfYear, endOfYear } from "date-fns";
import SalesReportByCategoryPDF from "./sales-report-category";

const SalesReport = () => {
  const [loadingSales, setLoadingSales] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [errorSales, setErrorSales] = useState("");

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const { data } = await api.get("/category-report");

        // Generate all months (Jan - Dec)
        const fullYearMonths = eachMonthOfInterval({
          start: startOfYear(new Date()),
          end: endOfYear(new Date()),
        }).map((date) => format(date, "MMM yyyy"));

        // Format sales data for each category
        // @ts-ignore
        const formattedData = data.data.map((item) => ({
          category: item.category, // ✅ Ensure categories are properly assigned
          salesData: fullYearMonths.map((month) => {
            const existingSale = item.salesData.find(
              // @ts-ignore
              (sale) =>
                format(parse(`${sale.month}-01`, "yyyy-MM-dd", new Date()), "MMM yyyy") === month
            );
            return {
              monthFormatted: month,
              totalSales: existingSale ? existingSale.totalSales : 0,
            };
          }),
        }));

        setSalesData(formattedData);
      } catch {
        setErrorSales("Failed to fetch sales report");
      } finally {
        setLoadingSales(false);
      }
    };
    fetchSalesReport();
  }, []);

  // **Processing Chart Data**
  let chartData;
  if (selectedCategory === "All") {
    // Aggregate sales per category and remove duplicates
    const distinctCategories = new Set();
    chartData = salesData
      .filter((item) => {
        // @ts-ignore
        if (distinctCategories.has(item.category)) return false;
        // @ts-ignore
        distinctCategories.add(item.category);
        return true;
      })
      .map((item) => ({
        // @ts-ignore
        category: item.category,
        // @ts-ignore
        totalSales: item.salesData.reduce((sum, entry) => sum + entry.totalSales, 0),
      }));
  } else {
    // Show monthly sales data for the selected category
    chartData =
    // @ts-ignore
      salesData.find((item) => item.category === selectedCategory)?.salesData || [];
  }

  return (
    <div className="space-y-4 p-8 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Sales Report</h2>
        <div className="flex gap-4 items-center">
          <select
            className="border rounded-md px-4 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {/* @ts-ignore */}
            {[...new Set(salesData.map((item) => item.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <SalesReportByCategoryPDF />
        </div>
      </div>

      <div className="h-[400px] w-full">
        {loadingSales ? (
          <div className="h-full flex justify-center items-center">
            <Skeleton className="w-full h-[350px]" />
          </div>
        ) : errorSales ? (
          <p className="text-red-500">{errorSales}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={selectedCategory === "All" ? "category" : "monthFormatted"}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  // @ts-ignore
                  angle: -30, // ✅ Slant labels
                  textAnchor: "end", // ✅ Align text properly
                }}
                interval={0} // ✅ Ensure all labels show
                dy={10} // ✅ Prevent label cutoff
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                domain={[0, "auto"]}
              />
              <Tooltip
                labelFormatter={(label) =>
                  selectedCategory === "All" ? `Category: ${label}` : `Month: ${label}`
                }
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="totalSales" fill="#00A3FF" barSize={40} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
