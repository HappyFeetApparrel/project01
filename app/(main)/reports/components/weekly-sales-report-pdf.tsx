"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { addHeader, addFooter } from "../../sales-orders/utils/inventory";

interface WeeklySalesReportPDFProps {
  startDate: string | undefined;
  endDate: string | undefined;
}

const WeeklySalesReportPDF = ({
  startDate,
  endDate,
}: WeeklySalesReportPDFProps) => {
  const [salesData, setSalesData] = useState<
    {
      time: string;
      mon: number;
      tue: number;
      wed: number;
      thu: number;
      fri: number;
      sat: number;
      sun: number;
    }[]
  >([]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchSalesData = async () => {
      const res = await fetch(
        `/api/weekly-sales?start=${startDate}&end=${endDate}`
      );
      const data = await res.json();
      console.log(data.data);
      setSalesData(data.data);
    };

    fetchSalesData();
  }, [startDate, endDate]);

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([750, 1000]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;
    const margin = 40;

    await addHeader(page, {
      title: `Weekly Sales Report (${startDate} to ${endDate})`,
      companyName: "Happy Feet and Apparel",
      logoPath: "/logo.png",
      logoWidth: 50, // Adjust as needed
      logoHeight: 50, // Adjust as needed
    });

    y -= 120;

    const headers = ["Time", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const colWidths = [60, 60, 60, 60, 60, 60, 60, 60];
    const startX = margin;

    const drawRow = (row: string[], yPos: number, isHeader = false) => {
      let x = startX;
      row.forEach((cell, index) => {
        page.drawText(cell, {
          x,
          y: yPos,
          size: isHeader ? 12 : 10,
          font,
          color: rgb(0, 0, 0),
        });
        x += colWidths[index];
      });
    };

    drawRow(headers, y, true);
    y -= 20;

    console.log(salesData);
    salesData.forEach((entry) => {
      if (y < 60) {
        page = pdfDoc.addPage([750, 1000]);
        y = height - 50;
        drawRow(headers, y, true);
        y -= 20;
      }

      drawRow(
        [
          entry.time || "", // Default to empty string if entry.time is undefined
          typeof entry.mon === "number" && !isNaN(entry.mon)
            ? entry.mon.toFixed(2)
            : "0.00",
          typeof entry.tue === "number" && !isNaN(entry.tue)
            ? entry.tue.toFixed(2)
            : "0.00",
          typeof entry.wed === "number" && !isNaN(entry.wed)
            ? entry.wed.toFixed(2)
            : "0.00",
          typeof entry.thu === "number" && !isNaN(entry.thu)
            ? entry.thu.toFixed(2)
            : "0.00",
          typeof entry.fri === "number" && !isNaN(entry.fri)
            ? entry.fri.toFixed(2)
            : "0.00",
          typeof entry.sat === "number" && !isNaN(entry.sat)
            ? entry.sat.toFixed(2)
            : "0.00",
          typeof entry.sun === "number" && !isNaN(entry.sun)
            ? entry.sun.toFixed(2)
            : "0.00",
        ],
        y
      );

      y -= 18;
    });

    await addFooter(page, {
      companyName: "Happy Feet and Apparel",
      website: "www.happyfeetandapparel.com",
      email: "contact@happyfeetandapparel.com",
      phone: "(123) 456-7890",
      pageNumber: 1,
      totalPages: 1,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="mt-4">
      <Button
        className="bg-[#00A3FF] hover:bg-[#00A3FF]/90"
        onClick={generatePDF}
        disabled={!salesData.length}
      >
        Generate Weekly Sales PDF
      </Button>
    </div>
  );
};

export default WeeklySalesReportPDF;
