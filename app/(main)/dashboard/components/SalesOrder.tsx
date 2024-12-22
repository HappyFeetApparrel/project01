"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

const data = [
  {
    channel: "Direct Sales",
    draft: 2,
    confirmed: 32,
    packed: 42,
    shipped: 23,
    invoiced: 7,
  },
  {
    channel: "Wholesale",
    draft: 0,
    confirmed: 41,
    packed: 33,
    shipped: 11,
    invoiced: 14,
  },
  {
    channel: "Retail",
    draft: 2,
    confirmed: 12,
    packed: 25,
    shipped: 16,
    invoiced: 21,
  },
];

export default function SalesOrder() {
  return (
    <div className="py-8 px-4 md:px-8 space-y-8 ">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold">Sales Order</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px] text-primary">
              <SelectValue placeholder="Select period" />
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="w-[90vw]">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[200px]">Channel</TableHead>
                <TableHead className="text-right">Draft</TableHead>
                <TableHead className="text-right">Confirmed</TableHead>
                <TableHead className="text-right">Packed</TableHead>
                <TableHead className="text-right">Shipped</TableHead>
                <TableHead className="text-right">Invoiced</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.channel}>
                  <TableCell className="font-medium">{row.channel}</TableCell>
                  <TableCell className="text-right">{row.draft}</TableCell>
                  <TableCell className="text-right">{row.confirmed}</TableCell>
                  <TableCell className="text-right">{row.packed}</TableCell>
                  <TableCell className="text-right">{row.shipped}</TableCell>
                  <TableCell className="text-right">{row.invoiced}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
