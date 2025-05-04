import React, { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import DefectSalesReportPDF from "../../sales-orders/components/defect-sales-report-pdf";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DefectSalesReport = () => {
  const YEAR = new Date().getFullYear();
  const MONTH = new Date().getMonth();
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<
    {
      month: string;
      lost: number;
      refund: number;
      other: number;
    }[]
  >([]);
  const [error, setError] = useState("");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(YEAR, MONTH, 1),
    to: addDays(new Date(YEAR, MONTH, 1), 20),
  });

  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  useEffect(() => {
    const fetchSalesReport = async () => {
      if (!startDate && !endDate) return;

      try {
        setLoading(true);

        const { data } = await api.get(
          `/product-returns-report?startDate=${startDate}&endDate=${endDate}`
        );

        const defaultData = months.map((month) => ({
          month,
          lost: 0,
          refund: 0,
          replace: 0,
          other: 0,
        }));

        data.data.months.forEach((item: any) => {
          const monthIndex = months.indexOf(item.month);
          if (monthIndex !== -1) {
            defaultData[monthIndex] = item;
          }
        });
        setSalesData(defaultData);
      } catch (error) {
        setError("Failed to fetch sales report");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, [startDate, endDate]);

  useEffect(() => {
    if (date) {
      const formattedStartDate = date?.from
        ? format(date.from, "yyyy-MM-dd")
        : "";
      const formattedEndDate = date?.to ? format(date.to, "yyyy-MM-dd") : "";

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    }
  }, [date]);

  return (
    <div className="space-y-4 p-8 bg-white">
      <div className="flex items-center justify-between flex-wrap">
        <h2 className="text-2xl font-semibold">Defect Sales Report</h2>
        <div className="flex flex-wrap justify-end gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-6 flex-wrap">
              <Legend color="#00A3FF" label="Lost" />
              <Legend color="#E93BF9" label="Refund" />
              <Legend color="#FF5733" label="Other" />
            </div>
            <DefectSalesReportPDF startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        {loading ? (
          <div className="h-full w-full flex justify-center items-center">
            <Skeleton className="w-full h-[350px]" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                domain={[0, "auto"]}
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
                dataKey="lost"
                stroke="#00A3FF"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="refund"
                stroke="#E93BF9"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="other"
                stroke="#FF5733"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

export default DefectSalesReport;
