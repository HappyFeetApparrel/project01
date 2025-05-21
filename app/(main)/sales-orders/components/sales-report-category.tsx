"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { format, subMonths } from "date-fns";
import { addHeader, addFooter } from "../utils/inventory";

interface SalesReportByCategoryPDFProps {
  selectedCategory: string;
}

const SalesReportPDF = ({
  selectedCategory,
}: SalesReportByCategoryPDFProps) => {
  const [salesData, setSalesData] = useState<
    {
      salesData: { month: string; totalSales: number }[];
      category: string;
      totalSales: number;
      totalOrders: number;
    }[]
  >([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      const response = await fetch("/api/category-report");
      const { data } = await response.json();

      // Optional: filter only for selectedCategory if passed
      const filteredData = selectedCategory
        ? data.filter(
            (item: { category: string }) => item.category === selectedCategory
          )
        : data;

      if (filteredData.length === 0) {
        setSalesData([]);
        return;
      }

      const summarized: {
        [category: string]: {
          category: string;
          totalSales: number;
          totalOrders: number;
          salesData: Record<string, number>;
        };
      } = {};

      filteredData.forEach(
        ({
          category,
          totalSales,
          totalOrders,
          salesData,
        }: {
          category: string;
          totalSales: number;
          totalOrders: number;
          salesData: { month: string; totalSales: number }[];
        }) => {
          if (!summarized[category]) {
            summarized[category] = {
              category,
              totalSales: 0,
              totalOrders: 0,
              salesData: {},
            };
          }

          summarized[category].totalSales += totalSales;
          summarized[category].totalOrders += totalOrders;

          salesData.forEach(({ month, totalSales }) => {
            if (!summarized[category].salesData[month]) {
              summarized[category].salesData[month] = 0;
            }
            summarized[category].salesData[month] += totalSales;
          });
        }
      );

      // Convert summarized object to array
      const finalData = Object.values(summarized).map((category) => ({
        ...category,
        salesData: Object.entries(category.salesData).map(
          ([month, totalSales]) => ({
            month,
            totalSales,
          })
        ),
      }));

      setSalesData(finalData);
      console.log(finalData);
    };

    fetchSalesData();
  }, [selectedCategory]);

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const [width, height] = PageSizes.A4;
    const leftMargin = 50;
    const rowHeight = 15;
    const minY = 100;

    const lastMonth = format(subMonths(new Date(), 1), "yyyy-MM");
    const lastMonthFormatted = format(subMonths(new Date(), 1), "MMMM yyyy");

    let page = pdfDoc.addPage([width, height]);
    let y = height - 50;
    let pageCount = 1;

    const addTableHeader = () => {
      page.drawText("Category", { x: leftMargin, y, size: 12, font: boldFont });
      page.drawText("Total Sales (PHP)", {
        x: 250,
        y,
        size: 12,
        font: boldFont,
      });
      page.drawText("Total Orders", { x: 450, y, size: 12, font: boldFont });

      y -= rowHeight;
      page.drawLine({
        start: { x: leftMargin, y },
        end: { x: width - leftMargin, y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      y -= rowHeight;
    };

    const newPage = () => {
      page = pdfDoc.addPage([width, height]);
      y = height - 50;

      addHeader(page, {
        title: `Sales Report - ${lastMonthFormatted}`,
        companyName: "Happy Feet and Apparel",
        logoPath: "/logo.png",
        logoWidth: 50,
        logoHeight: 50,
      });

      y -= 120;
      addTableHeader();
      pageCount++;
    };

    await addHeader(page, {
      title: `Sales Report - ${lastMonthFormatted}`,
      companyName: "Happy Feet and Apparel",
      logoPath: "/logo.png",
      logoWidth: 50,
      logoHeight: 50,
    });

    y -= 120;
    addTableHeader();

    for (let i = 0; i < salesData.length; i++) {
      const { category, totalSales, totalOrders } = salesData[i];
      console.log(salesData[i]);

      if (y < minY) {
        await addFooter(page, {
          companyName: "Happy Feet and Apparel",
          website: "www.happyfeetandapparel.com",
          email: "contact@happyfeetandapparel.com",
          phone: "(123) 456-7890",
          pageNumber: pageCount,
          // @ts-ignore
          totalPages: "auto", // We'll replace it later
        });

        newPage();
      }

      page.drawText(category, { x: leftMargin, y, size: 10, font });
      page.drawText(`PHP ${Number(totalSales).toFixed(2)}`, {
        x: 250,
        y,
        size: 10,
        font,
      });
      page.drawText(String(totalOrders), {
        x: 450,
        y,
        size: 10,
        font,
      });

      y -= rowHeight;
    }

    // Final footer
    await addFooter(page, {
      companyName: "Happy Feet and Apparel",
      website: "www.happyfeetandapparel.com",
      email: "contact@happyfeetandapparel.com",
      phone: "(123) 456-7890",
      pageNumber: pageCount,
      // @ts-ignore
      totalPages: "auto",
    });

    // Save and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Sales_Report_${lastMonth}.pdf`;
    link.click();
  };

  return (
    <div>
      <Button onClick={generatePDF} className="mb-0">
        Download Sales Report
      </Button>
    </div>
  );
};

export default SalesReportPDF;
