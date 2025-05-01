"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { format, subMonths } from "date-fns";
import { addHeader, addFooter } from "../utils/inventory";

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

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    await addHeader(page, {
      title: `Sales Report - ${lastMonthFormatted}`,
      companyName: "Happy Feet and Apparel",
      logoPath: "/logo.png",
      logoWidth: 50, // Adjust as needed
      logoHeight: 50, // Adjust as needed
    });

    y -= 120;

    // Table Headers
    page.drawText("Category", { x: leftMargin, y, size: 12, font });
    page.drawText("Total Sales (PHP)", { x: 250, y, size: 12, font });
    page.drawText("Total Orders", { x: 450, y, size: 12, font });

    y -= 15;
    page.drawLine({
      start: { x: leftMargin, y },
      end: { x: width - leftMargin, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= 15;

    // Filter sales data for last month
    // const filteredSales = salesData
    //   .map((category) => {
    //     const lastMonthSales = category.salesData.find(
    //       (sale: any) => sale.month === lastMonth
    //     );

    //     console.log("category");
    //     console.log(lastMonthSales);
    //     console.log("category");
    //     return {
    //       category: category?.category || 0,
    //       totalSales: lastMonthSales ? lastMonthSales.totalSales : 0,
    //       // @ts-ignore
    //       totalOrders: lastMonthSales ? category.totalOrders : 0,
    //     };
    //   })
    //   .filter((sale) => sale.totalSales > 0 || sale.totalOrders > 0);

    // Add sales data to the table
    // @ts-ignore
    salesData.forEach(({ category, totalSales, totalOrders }) => {
      if (y < 50) return;

      page.drawText(category, { x: leftMargin, y, size: 10, font });
      page.drawText(`PHP ${(totalSales as number).toFixed(2)}`, {
        x: 250,
        y,
        size: 10,
        font,
      });
      page.drawText((totalOrders as number).toString(), {
        x: 450,
        y,
        size: 10,
        font,
      });

      y -= 15;
    });

    await addFooter(page, {
      companyName: "Happy Feet and Apparel",
      website: "www.happyfeetandapparel.com",
      email: "contact@happyfeetandapparel.com",
      phone: "(123) 456-7890",
      pageNumber: 1,
      totalPages: 1,
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
