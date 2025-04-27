"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { addHeader, addFooter } from "../utils/inventory";
interface DefectSalesReportPDFProps {
  startDate: string | undefined;
  endDate: string | undefined;
}

const DefectSalesReportPDF = ({
  startDate,
  endDate,
}: DefectSalesReportPDFProps) => {
  const [defectData, setDefectData] = useState([]);

  useEffect(() => {
    if (!startDate && !endDate) return;

    const fetchDefectData = async () => {
      const response = await fetch(
        `/api/product-returns-report?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setDefectData(data.data);
    };

    fetchDefectData();
  }, [startDate, endDate]);
  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const leftMargin = 50;
    const date = new Date();

    // 1st page: Itemized Defect Details
    const firstPage = pdfDoc.addPage([600, 800]);
    const { width: pageWidth, height: pageHeight } = firstPage.getSize();
    let y = pageHeight - 170;

    // Add header with logo
    await addHeader(firstPage, {
      title: `Defect Sales Report - ${date.getFullYear()}`,
      companyName: "Happy Feet and Apparel",
      logoPath: "/logo.png",
      logoWidth: 50, // Adjust as needed
      logoHeight: 50, // Adjust as needed
    });

    firstPage.drawText("Item/SKU/Code", { x: leftMargin, y, size: 12, font });
    firstPage.drawText("Status", { x: 200, y, size: 12, font });
    firstPage.drawText("Date", { x: 320, y, size: 12, font });
    firstPage.drawText("Name", { x: 450, y, size: 12, font });

    y -= 15;
    firstPage.drawLine({
      start: { x: leftMargin, y },
      end: { x: pageWidth - leftMargin, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= 15;

    // @ts-ignore
    defectData?.returns.forEach(({ sku, status, date, name }) => {
      if (y < 50) return;
      firstPage.drawText(sku, { x: leftMargin, y, size: 10, font });
      firstPage.drawText(status, { x: 200, y, size: 10, font });
      firstPage.drawText(date, { x: 320, y, size: 10, font });
      firstPage.drawText(name, { x: 450, y, size: 10, font });
      y -= 15;
    });

    // Add footer
    await addFooter(firstPage, {
      companyName: "Happy Feet and Apparel",
      website: "www.happyfeetandapparel.com",
      email: "contact@happyfeetandapparel.com",
      phone: "(123) 456-7890",
      pageNumber: 1,
      totalPages: 1,
    });
    // 2nd page: Defect Sales Summary
    const secondPage = pdfDoc.addPage([600, 800]);
    const { width: secondWidth, height: secondHeight } = secondPage.getSize();
    let y2 = secondHeight - 170;

    await addHeader(secondPage, {
      title: `Defect Sales Report - ${date.getFullYear()}`,
      companyName: "Happy Feet and Apparel",
      logoPath: "/logo.png",
      logoWidth: 50, // Adjust as needed
      logoHeight: 50, // Adjust as needed
    });

    secondPage.drawText("Month", { x: leftMargin, y: y2, size: 12, font });
    secondPage.drawText("Lost", { x: 100, y: y2, size: 12, font });
    secondPage.drawText("Return", { x: 200, y: y2, size: 12, font });
    secondPage.drawText("Refund", { x: 300, y: y2, size: 12, font });
    secondPage.drawText("Replace", { x: 400, y: y2, size: 12, font });
    secondPage.drawText("Other", { x: 500, y: y2, size: 12, font });

    y2 -= 15;
    secondPage.drawLine({
      start: { x: leftMargin, y: y2 },
      end: { x: secondWidth - leftMargin, y: y2 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y2 -= 15;

    // @ts-ignore
    defectData?.months.forEach(
      // @ts-ignore
      ({ month, lost, return: returns, refund, replace, other }) => {
        if (y2 < 50) return;
        secondPage.drawText(month, { x: leftMargin, y: y2, size: 10, font });
        secondPage.drawText(String(lost), { x: 100, y: y2, size: 10, font });
        secondPage.drawText(String(returns), { x: 200, y: y2, size: 10, font });
        secondPage.drawText(String(refund), { x: 300, y: y2, size: 10, font });
        secondPage.drawText(String(replace), { x: 400, y: y2, size: 10, font });
        secondPage.drawText(String(other), { x: 500, y: y2, size: 10, font });
        y2 -= 15;
      }
    );

    await addFooter(secondPage, {
      companyName: "Happy Feet and Apparel",
      website: "www.happyfeetandapparel.com",
      email: "contact@happyfeetandapparel.com",
      phone: "(123) 456-7890",
      pageNumber: 1,
      totalPages: 1,
    });

    // Save and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Defect_Sales_Report_${format(subMonths(new Date(), 1), "yyyy-MM")}.pdf`;
    link.click();
  };

  return (
    <div className="p-4">
      <Button onClick={generatePDF} className="mb-0">
        Download Defect Sales Report
      </Button>
    </div>
  );
};

export default DefectSalesReportPDF;
