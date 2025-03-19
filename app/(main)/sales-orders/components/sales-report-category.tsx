"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { format, subMonths } from "date-fns";

const SalesReportPDF = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      const response = await fetch("/api/category-report");
      const data = await response.json();
      setSalesData(data.data);
    };
    fetchSalesData();
  }, []);

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;
    const leftMargin = 50;

    // Get last month's date
    const lastMonth = format(subMonths(new Date(), 1), "yyyy-MM");
    const lastMonthFormatted = format(subMonths(new Date(), 1), "MMMM yyyy");

    // Title
    const title = `Sales Report - ${lastMonthFormatted}`;
    page.drawText(title, {
      x: leftMargin,
      y,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 30;

    // Table Headers
    page.drawText("Category", { x: leftMargin, y, size: 12, font });
    page.drawText("Total Sales (PHP)", { x: 250, y, size: 12, font });
    page.drawText("Total Orders", { x: 450, y, size: 12, font });

    y -= 15;
    page.drawLine({ start: { x: leftMargin, y }, end: { x: width - leftMargin, y }, thickness: 1, color: rgb(0, 0, 0) });
    y -= 15;

    // Filter sales data for last month
    const filteredSales = salesData.map((category) => {
        // @ts-ignore
      const lastMonthSales = category.salesData.find((sale) => sale.month === lastMonth);
      return {
        // @ts-ignore
        category: category.category,
        totalSales: lastMonthSales ? lastMonthSales.totalSales : 0,
        // @ts-ignore
        totalOrders: lastMonthSales ? category.totalOrders : 0,
      };
    });

    // Add sales data to the table
    filteredSales.forEach(({ category, totalSales, totalOrders }) => {
      if (y < 50) return;

      page.drawText(category, { x: leftMargin, y, size: 10, font });
      page.drawText(`PHP ${totalSales.toFixed(2)}`, { x: 250, y, size: 10, font });
      page.drawText(totalOrders.toString(), { x: 450, y, size: 10, font });

      y -= 15;
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Sales_Report_${lastMonth}.pdf`;
    link.click();
  };

  return (
    <div className="">
      <Button onClick={generatePDF} className="mb-0">
        Download Sales Report
      </Button>
    </div>
  );
};

export default SalesReportPDF;
