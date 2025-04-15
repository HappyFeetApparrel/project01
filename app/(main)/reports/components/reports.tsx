"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";

import { ChevronLeft, ChevronRight, Printer, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useState, useEffect, useRef } from "react";

import WeeklySalesReportPDF from "./weekly-sales-report-pdf";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  subWeeks,
  addWeeks,
} from "date-fns";
import { useLayout } from "@/components/context/LayoutProvider";
import { isAfter, isBefore, isSameDay } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export interface WeeklySalesData {
  time: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

function getColorForValue(value: number): string {
  if (value <= 500) return "bg-[#E3F2FD]";
  if (value <= 1000) return "bg-[#29B6F6]";
  return "bg-[#0277BD]";
}

// Get current week's range
const getCurrentWeekRange = () => {
  const today = new Date();
  return {
    start: startOfWeek(today, { weekStartsOn: 1 }),
    end: endOfWeek(today, { weekStartsOn: 1 }),
  };
};

export default function Reports() {
  const { saveActivity } = useLayout();

  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(
    getCurrentWeekRange
  );
  const [weeklySales, setWeeklySales] = useState<WeeklySalesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const formattedRange = `${format(dateRange.start, "MMM d")} - ${format(dateRange.end, "d")}`;
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchWeeklySales = async () => {
    setLoading(true);
    try {
      const range = `${format(dateRange.start, "MMM d")} - ${format(
        dateRange.end,
        "d"
      )}`;
      const { data } = await api.get(
        `/weekly-sales?dateRange=${range}&start=${format(dateRange.start, "yyyy-MM-dd")}&end=${format(dateRange.end, "yyyy-MM-dd")}`
      );
      setWeeklySales(data.data);
    } catch (err) {
      setError("Failed to load weekly sales. Please try again.");
      console.error("Error fetching weekly sales:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklySales();
  }, [dateRange]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const start = selectedDate;
      const end = addDays(selectedDate, 6);
      setDateRange({ start, end });
      setIsPopoverOpen(false); // Close the popover when a date is selected
    }
  };

  const handlePrint = () => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.autoPrint();
      saveActivity(`Downloaded PDF`, "download");

      window.open(pdf.output("bloburl"), "_blank");
    });
  };

  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // const handleDateSelect = (date: Date | undefined) => {
  //   if (!date) return;
  //   setDateRange({ start: date });
  // };

  // Function to check if a date is in the hovered range
  const isInHoveredRange = (date: Date) => {
    if (!dateRange.start || !hoveredDate) return false;
    return (
      (isAfter(date, dateRange.start) && isBefore(date, hoveredDate)) ||
      isSameDay(date, dateRange.start) ||
      isSameDay(date, hoveredDate)
    );
  };

  return (
    <div className="w-full space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-7">
          <CardTitle className="text-2xl font-bold">Reports</CardTitle>
          <WeeklySalesReportPDF
            startDate={format(dateRange.start, "yyyy-MM-dd")}
            endDate={format(dateRange.end, "yyyy-MM-dd")}
          />
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Weekly Sales Section */}
          <div className="space-y-4 p-6" ref={reportRef}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Weekly Sales</h3>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-[#00A3FF]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formattedRange}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.start}
                    onSelect={handleDateSelect}
                    modifiers={{
                      start: dateRange.start,
                      end: addDays(dateRange.start ?? new Date(), 6),
                      // @ts-ignore
                      hovered:
                        hoveredDate && ((date) => isInHoveredRange(date)), // ✅ Fix
                    }}
                    modifiersClassNames={{
                      start: "bg-blue-500 text-white", // Start date style
                      end: "bg-blue-500 text-white", // End date style
                      hovered: "bg-blue-200", // Hovered range style
                    }}
                    onDayMouseEnter={(date) => setHoveredDate(date)}
                    onDayMouseLeave={() => setHoveredDate(null)}
                  />
                  {/* <Calendar
                    mode="single"
                    selected={dateRange.start}
                    onSelect={handleDateSelect}
                    modifiers={{
                      start: dateRange.start,
                      end: addDays(dateRange.start, 6),
                    }}
                    modifiersStyles={{
                      start: { backgroundColor: 'blue', color: 'white' },
                      end: { backgroundColor: 'blue', color: 'white' },
                    }}
                  /> */}
                </PopoverContent>
              </Popover>
            </div>

            {error ? (
              <div className="text-red-500 text-center">
                <h3>Error loading weekly sales data</h3>
                <p>{error}</p>
              </div>
            ) : (
              <div className="space-y-2 h-[500px] overflow-y-auto">
                <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-1">
                  <div className="text-sm text-muted-foreground"></div>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm text-muted-foreground"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {loading
                  ? Array.from({ length: 10 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[80px_repeat(7,1fr)] gap-1"
                      >
                        <div className="text-sm text-muted-foreground">
                          --:--
                        </div>
                        {Array.from({ length: 7 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-12 rounded bg-primary/30"
                          />
                        ))}
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
                        {[
                          row.mon,
                          row.tue,
                          row.wed,
                          row.thu,
                          row.fri,
                          row.sat,
                          row.sun,
                        ].map((value, i) => (
                          <div
                            key={i}
                            className={`h-12 rounded ${getColorForValue(value)}`}
                          />
                        ))}
                      </div>
                    ))}
              </div>
            )}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-[#E3F2FD]" />
                <span className="text-sm text-muted-foreground">0-500</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-[#29B6F6]" />
                <span className="text-sm text-muted-foreground">501-1,000</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-[#0277BD]" />
                <span className="text-sm text-muted-foreground">
                  1,001-5,000
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
