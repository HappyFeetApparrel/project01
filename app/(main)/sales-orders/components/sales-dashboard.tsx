"use client";

import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { month: "Jan", directSales: 10000, retail: 5000, wholesale: 7000 },
  { month: "Feb", directSales: 9000, retail: 7000, wholesale: 10000 },
  { month: "Mar", directSales: 15000, retail: 5000, wholesale: 8000 },
  { month: "Apr", directSales: 10000, retail: 8000, wholesale: 9000 },
  { month: "May", directSales: 12000, retail: 6000, wholesale: 5000 },
  { month: "Jun", directSales: 8000, retail: 10000, wholesale: 7000 },
  { month: "Jul", directSales: 16000, retail: 6000, wholesale: 10000 },
  { month: "Aug", directSales: 11000, retail: 4000, wholesale: 3000 },
  { month: "Sep", directSales: 15000, retail: 18000, wholesale: 8000 },
  { month: "Oct", directSales: 8000, retail: 5000, wholesale: 9000 },
  { month: "Nov", directSales: 19000, retail: 5000, wholesale: 14000 },
  { month: "Dec", directSales: 22000, retail: 10000, wholesale: 17000 },
];

const ordersData = [
  {
    id: 1,
    productName: "Macbook Pro",
    orderCode: "#0001",
    category: "Laptop",
    quantity: 1,
    totalPrice: 1241,
  },
  {
    id: 2,
    productName: "Macbook Pro",
    orderCode: "#0001",
    category: "Laptop",
    quantity: 1,
    totalPrice: 1241,
  },
  {
    id: 3,
    productName: "Macbook Pro",
    orderCode: "#0001",
    category: "Laptop",
    quantity: 1,
    totalPrice: 1241,
  },
  {
    id: 4,
    productName: "Macbook Pro",
    orderCode: "#0001",
    category: "Laptop",
    quantity: 1,
    totalPrice: 1241,
  },
  {
    id: 5,
    productName: "Macbook Pro",
    orderCode: "#0001",
    category: "Laptop",
    quantity: 1,
    totalPrice: 1241,
  },
];

export default function SalesDashboard() {
  return (
    <div className="w-full space-y-8">
      {/* Sales Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Sales Orders</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search" className="w-[300px] pl-9" />
            </div>
            <Button className="bg-[#00A3FF] hover:bg-[#00A3FF]/90">
              <Plus className="mr-2 h-4 w-4" />
              Place Order
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 text-left align-middle">
                    <Checkbox />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Product Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Order Code
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Quantity
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Total Price
                  </th>
                  <th className="h-12 px-4 text-right align-middle">
                    <Select defaultValue="7days">
                      <SelectTrigger className="w-[130px] text-[#00A3FF]">
                        <SelectValue placeholder="Select period" />
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ordersData.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <Checkbox />
                    </td>
                    <td className="p-4 font-medium">{order.productName}</td>
                    <td className="p-4">{order.orderCode}</td>
                    <td className="p-4">{order.category}</td>
                    <td className="p-4">{order.quantity}</td>
                    <td className="p-4">${order.totalPrice}</td>
                    <td className="p-4 text-right">
                      <Button variant="link" className="text-[#00A3FF]">
                        View Invoice
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center space-x-2 py-4">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#00A3FF] text-white hover:bg-[#00A3FF]/90"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              4
            </Button>
            <Button variant="outline" size="sm">
              5
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sales Report Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Sales Report</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#00A3FF]" />
              <span className="text-sm text-muted-foreground">
                Direct Sales
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#9747FF]" />
              <span className="text-sm text-muted-foreground">Retail</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#E93BF9]" />
              <span className="text-sm text-muted-foreground">Wholesale</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
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
        </div>
      </div>
    </div>
  );
}
