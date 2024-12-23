"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Download } from "lucide-react";

const data = [
  { name: "Apple", value: 61, color: "#00A3FF" },
  { name: "Samsung", value: 15, color: "#E91E63" },
  { name: "Asus", value: 13, color: "#4CAF50" },
  { name: "Xiaomi", value: 8, color: "#9C27B0" },
];

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
  return (
    <div className="w-full max-w-3xl space-y-8">
      {/* Top Suppliers Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Top Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
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
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  formatter={(value, entry) => (
                    <span className="text-sm" style={{ color: entry.color }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Report */}
      <Card>
        <CardContent className="flex flex-col items-center p-6 text-center">
          <h3 className="text-xl font-semibold">Reports for Last Month</h3>
          <p className="text-sm text-muted-foreground">From 01 Jul - 31 Jul</p>
          <div className="mt-4 flex items-center gap-4">
            <Button className="bg-[#00A3FF] hover:bg-[#00A3FF]/90">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="link" className="text-[#00A3FF]">
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Defect Rate Report */}
      <Card>
        <CardContent className="flex flex-col items-center p-6 text-center">
          <h3 className="text-xl font-semibold">Defect Rate Report</h3>
          <p className="text-sm text-muted-foreground">
            Product Defects & Supplier Origin
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Button className="bg-[#9C27B0] hover:bg-[#9C27B0]/90">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="link" className="text-[#9C27B0]">
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
