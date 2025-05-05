"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { format, subMonths } from "date-fns";
import {
  addHeader,
  addFooter,
} from "@/app/(main)/sales-orders/utils/inventory";

interface SalesData {
  months: {
    month: string;
    lost: number;
    refund: number;
    other: number;
  }[];
}

const DefectSalesReportPDF = () => {
  const [salesData, setSalesData] = useState<SalesData>();

  useEffect(() => {
    const fetchSalesData = async () => {
      const lastMonth = format(subMonths(new Date(), 1), "yyyy-MM");
      const startDate = `${lastMonth}-01`;
      const endDate = format(new Date(), "yyyy-MM-dd");

      const response = await fetch(
        `/api/product-returns-report?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setSalesData(data.data);
    };
    fetchSalesData();
  }, []);

  const generateAndOpenPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;
    const leftMargin = 50;

    // Get last month's date
    const date = new Date();

    // Title
    page.drawText("Happy Feet and Apparel", {
      x: leftMargin,
      y,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Report Date
    y -= 20;

    // Title
    page.drawText(`Defect Sales Report - ${date.getFullYear()}`, {
      x: leftMargin,
      y,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    await addHeader(page, {
      title: `Defect Sales Report - ${date.getFullYear()}`,
      companyName: "Happy Feet and Apparel",
      logoPath: "/logo.png",
      logoWidth: 50, // Adjust as needed
      logoHeight: 50, // Adjust as needed
    });

    y -= 120;

    // Table Headers
    page.drawText("Month", { x: leftMargin, y, size: 12, font });
    page.drawText("Lost", { x: 200, y, size: 12, font });
    page.drawText("Refund", { x: 300, y, size: 12, font });
    page.drawText("Other", { x: 400, y, size: 12, font });

    y -= 15;
    page.drawLine({
      start: { x: leftMargin, y },
      end: { x: width - leftMargin, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= 15;

    // Add sales data to the table
    salesData?.months.forEach(({ month, lost, refund, other }) => {
      if (y < 50) return;

      page.drawText(month, { x: leftMargin, y, size: 10, font });
      page.drawText(String(lost), { x: 200, y, size: 10, font });
      page.drawText(String(refund), { x: 300, y, size: 10, font });
      page.drawText(String(other), { x: 400, y, size: 10, font });

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

    // Save PDF and open in new tab
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="p-4">
      <Button
        variant="link"
        className="text-[#9C27B0]"
        onClick={generateAndOpenPDF}
      >
        View
      </Button>
    </div>
  );
};

export default DefectSalesReportPDF;
