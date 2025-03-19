"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Download } from "lucide-react";
import { api } from "@/lib/axios";
import ViewDefectSalesPDF from "./supplier-components/view-defect-reports";
import DefectSalesReportDownload from "./supplier-components/download-defect-reports";

import { ThreeDots } from "react-loader-spinner";

interface LabelConfig {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelConfig) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SupplierAnalytics() {
  const [data, setData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingDownload, setLoadingDownload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/top-suppliers"); // Replace with your API route
        setData(response.data.data || []); // Fallback to an empty array if no data
      } catch (error) {
        console.error("Error fetching top suppliers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const baseUrl = "/api/reports/last-month";

  const handleDownload = async () => {
    setLoadingDownload(true);
    const response = await fetch(`${baseUrl}?mode=download`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sales_Report_July.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setLoadingDownload(false);
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lastMonth = currentMonth - 1;
  const lastMonthYear = lastMonth < 0 ? currentYear - 1 : currentYear;

  const startDate = new Date(lastMonthYear, lastMonth, 1);
  const endDate = new Date(lastMonthYear, lastMonth + 1, 0);

  const startMonth = startDate.toLocaleString("default", { month: "long" });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  return (
    <div className="w-full xl:max-w-sm max-w-full space-y-8">
      {/* Top Suppliers Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Top Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No supplier data available.
            </p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    formatter={(value, entry) => (
                      <span className="text-sm" style={{ color: entry.color }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Report */}
      <Card>
        <CardContent className="flex flex-col items-center p-6 text-center">
          <h3 className="text-xl font-semibold">Reports for Last Month</h3>
          <p className="text-sm text-muted-foreground">
            From {startDay} {startMonth} - {endDay} {startMonth}
          </p>
          <div className="mt-4 flex items-center gap-4">
            {/* <Button
              className="bg-[#00A3FF] hover:bg-[#00A3FF]/90"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button> */}
            <Button
              type="submit"
              disabled={loadingDownload}
              className="bg-[#00A3FF] hover:bg-[#00A3FF]/90 w-[150px]"
              onClick={handleDownload}
            >
              <span className={`${loadingDownload ? "hidden" : "flex"}`}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </span>
              <ThreeDots
                visible={true}
                height="50"
                width="50"
                color="#fff"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass={`${loadingDownload ? "block" : "!hidden"}`}
              />
            </Button>
            <Button variant="link" className="text-[#00A3FF]" asChild>
              <a
                href={`${baseUrl}?mode=view`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Defect Rate Report */}
      <Card>
        <CardContent className="flex flex-col items-center p-6 text-center">
          <h3 className="text-xl font-semibold">Defect Rate Report for Last Month</h3>
          <p className="text-sm text-muted-foreground">
            From {startDay} {startMonth} - {endDay} {startMonth}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <DefectSalesReportDownload />
           <ViewDefectSalesPDF />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
