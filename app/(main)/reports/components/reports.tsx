"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";

import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useState, useEffect } from "react";

import { format, startOfWeek, endOfWeek, subWeeks, addWeeks } from "date-fns";

interface WeeklySalesData {
  time: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}
// const supplierData = [
//   { name: "Apple", early: 74, onTime: 18, late: 8 },
//   { name: "Samsung", early: 73, onTime: 13, late: 14 },
//   { name: "Asus", early: 47, onTime: 18, late: 35 },
//   { name: "Xiaomi", early: 67, onTime: 12, late: 21 },
//   { name: "Logitech", early: 62, onTime: 28, late: 10 },
// ];

const weeklyDataLoading: WeeklySalesData[] = [
  {
    time: "09:00",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
  {
    time: "10:00",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
  {
    time: "11:00",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
  {
    time: "12:00",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
  {
    time: "13:00",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
  {
    time: "14:00",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
  {
    time: "15:00",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
  {
    time: "16:00",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
];

function getColorForValue(value: number): string {
  if (value <= 500) return "bg-[#E3F2FD]";
  if (value <= 1000) return "bg-[#29B6F6]";
  return "bg-[#0277BD]";
}

// Function to get the current week's date range
const getCurrentWeekRange = () => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(today, { weekStartsOn: 1 }); // Sunday end

  return { start, end };
};

export default function Reports() {
  const [weeklySales, setWeeklySales] = useState<WeeklySalesData[]>([]);
  const [loadingWeeklySales, setLoadingWeeklySales] = useState(true);
  const [errorWeeklySales, setErrorWeeklySales] = useState("");

  const [weekRange, setWeekRange] = useState(getCurrentWeekRange());

  // Format the date range for display (e.g., "Aug 19-25")
  const formattedRange = `${format(weekRange.start, "MMM d")} - ${format(
    weekRange.end,
    "d"
  )}`;

  // Function to move to the previous week
  const goToPreviousWeek = () => {
    const prevStart = subWeeks(weekRange.start, 1);
    const prevEnd = subWeeks(weekRange.end, 1);
    setWeekRange({ start: prevStart, end: prevEnd });
  };

  // Function to move to the next week
  const goToNextWeek = () => {
    const nextStart = addWeeks(weekRange.start, 1);
    const nextEnd = addWeeks(weekRange.end, 1);
    setWeekRange({ start: nextStart, end: nextEnd });
  };

  const fetchWeeklySales = async () => {
    setLoadingWeeklySales(true);
    try {
      const { data } = await api.get(
        `/weekly-sales?dateRange=${formattedRange}`
      );
      setWeeklySales(data.data);
    } catch (err) {
      setErrorWeeklySales("Failed to load weekly sales. Please try again.");
      console.error("Error fetching weekly sales:", err);
    } finally {
      setLoadingWeeklySales(false);
    }
  };

  useEffect(() => {
    fetchWeeklySales();
  }, [weekRange]);

  return (
    <div className="w-full space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold">Reports</CardTitle>
          <Button className="bg-[#00A3FF] hover:bg-[#00A3FF]/90">
            <Printer className="mr-2 h-4 w-4" />
            Print Reports
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Weekly Sales Section */}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Weekly Sales</h3>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-[#00A3FF]">{formattedRange}</span>
                <Button variant="ghost" size="icon" onClick={goToNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {
              // loadingWeeklySales ? (
              // // Render skeleton loading
              // <div className="space-y-2">
              //   <Skeleton className="w-full h-[500px]" />
              // </div>
              // ) :
              errorWeeklySales ? (
                // Render error message
                <div className="text-red-500 text-center">
                  <h3>Error loading weekly sales data</h3>
                  <p>{errorWeeklySales}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-1">
                    <div className="text-sm text-muted-foreground"></div>
                    <div className="text-center text-sm text-muted-foreground">
                      Mon
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Tue
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Wed
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Thu
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Fri
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Sat
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Sun
                    </div>
                  </div>

                  {loadingWeeklySales
                    ? weeklyDataLoading.map((row) => (
                        <div
                          key={row.time}
                          className="grid grid-cols-[80px_repeat(7,1fr)] gap-1"
                        >
                          <div className="text-sm text-muted-foreground">
                            {row.time}
                          </div>

                          <Skeleton className={`h-12 rounded bg-primary/30`} />
                          <Skeleton className={`h-12 rounded bg-primary/30`} />
                          <Skeleton className={`h-12 rounded bg-primary/30`} />
                          <Skeleton className={`h-12 rounded bg-primary/30`} />
                          <Skeleton className={`h-12 rounded bg-primary/30`} />
                          <Skeleton className={`h-12 rounded bg-primary/30`} />
                          <Skeleton className={`h-12 rounded bg-primary/30`} />
                        </div>
                      ))
                    : weeklySales.map((row) => (
                        <div
                          key={row.time}
                          className="grid grid-cols-[80px_repeat(7,1fr)] gap-1"
                        >
                          <div className="text-sm text-muted-foreground">
                            {row.time}
                          </div>
                          <div
                            className={`h-12 rounded ${getColorForValue(
                              row.mon
                            )}`}
                          />
                          <div
                            className={`h-12 rounded ${getColorForValue(
                              row.tue
                            )}`}
                          />
                          <div
                            className={`h-12 rounded ${getColorForValue(
                              row.wed
                            )}`}
                          />
                          <div
                            className={`h-12 rounded ${getColorForValue(
                              row.thu
                            )}`}
                          />
                          <div
                            className={`h-12 rounded ${getColorForValue(
                              row.fri
                            )}`}
                          />
                          <div
                            className={`h-12 rounded ${getColorForValue(
                              row.sat
                            )}`}
                          />
                          <div
                            className={`h-12 rounded ${getColorForValue(
                              row.sun
                            )}`}
                          />
                        </div>
                      ))}

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-[#E3F2FD]" />
                      <span className="text-sm text-muted-foreground">
                        0-500
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-[#29B6F6]" />
                      <span className="text-sm text-muted-foreground">
                        501-1,000
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-[#0277BD]" />
                      <span className="text-sm text-muted-foreground">
                        1,001-5,000
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
          </div>

          {/* Supplier Performance Report Section */}
          {/* <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Supplier Performance Report
                <span className="ml-2 text-sm text-muted-foreground">
                  (Top 5 Suppliers)
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              {supplierData.map((supplier) => (
                <div key={supplier.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{supplier.name}</span>
                  </div>
                  <div className="flex h-4 w-full overflow-hidden rounded">
                    <div
                      className="bg-[#00A3FF]"
                      style={{ width: `${supplier.early}%` }}
                    />
                    <div
                      className="bg-[#FFA726]"
                      style={{ width: `${supplier.onTime}%` }}
                    />
                    <div
                      className="bg-[#E91E63]"
                      style={{ width: `${supplier.late}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{supplier.early}% Early</span>
                    <span>{supplier.onTime}% On Time</span>
                    <span>{supplier.late}% Late</span>
                  </div>
                </div>
              ))}

              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[#00A3FF]" />
                  <span className="text-sm text-muted-foreground">Early</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[#FFA726]" />
                  <span className="text-sm text-muted-foreground">On Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[#E91E63]" />
                  <span className="text-sm text-muted-foreground">Late</span>
                </div>
              </div>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
