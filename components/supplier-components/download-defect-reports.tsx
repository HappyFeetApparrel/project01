"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { format, subMonths } from "date-fns";
import { Download } from "lucide-react";
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

const DefectSalesReportDownload = () => {
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
      console.log(data.data);
      setSalesData(data.data);
    };
    fetchSalesData();
  }, []);

  const generateAndDownloadPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;
    const leftMargin = 50;

    // Get last month's date
    const date = new Date();

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
    page.drawText("Lost", { x: 300, y, size: 12, font });
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

    // Save PDF and trigger download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Defect_Sales_Report_${date.getFullYear()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <Button
        className="bg-[#9C27B0] hover:bg-[#9C27B0]/90"
        onClick={generateAndDownloadPDF}
      >
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
    </div>
  );
};

export default DefectSalesReportDownload;
