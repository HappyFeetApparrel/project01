"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface DefectProductReportPDFProps {
  startDate: string | undefined;
  endDate: string | undefined;
}

const DefectProductReportPDF = ({
  startDate,
  endDate,
}: DefectProductReportPDFProps) => {
  const [defectData, setDefectData] = useState([]);

  useEffect(() => {
    if (!startDate && !endDate) return;

    const fetchDefectData = async () => {
      const response = await fetch(
        `/api/product-defect-reports?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setDefectData(data.data);
    };

    fetchDefectData();
  }, [startDate, endDate]);

  const generatePDF = async () => {
    console.log("OK");
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;
    const leftMargin = 50;
    const lastMonthFormatted = format(subMonths(new Date(), 1), "MMMM yyyy");

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

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

    page.drawText(`Defect Product Reports - ${lastMonthFormatted}`, {
      x: leftMargin,
      y,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 30;

    page.drawText("Month", { x: leftMargin, y, size: 12, font });
    page.drawText("Lost", { x: 150, y, size: 12, font });
    page.drawText("Return", { x: 250, y, size: 12, font });
    page.drawText("Refund", { x: 350, y, size: 12, font });
    page.drawText("Other", { x: 450, y, size: 12, font });
    y -= 15;
    page.drawLine({
      start: { x: leftMargin, y },
      end: { x: width - leftMargin, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= 15;

    defectData.forEach(({ month, lost, return: returns, refund, other }) => {
      if (y < 50) return;

      page.drawText(month, { x: leftMargin, y, size: 10, font });
      page.drawText(String(lost), { x: 150, y, size: 10, font });
      page.drawText(String(returns), { x: 250, y, size: 10, font });
      page.drawText(String(refund), { x: 350, y, size: 10, font });
      page.drawText(String(other), { x: 450, y, size: 10, font });
      y -= 15;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Defect_Product_Report_${format(subMonths(new Date(), 1), "yyyy-MM")}.pdf`;
    link.click();
  };

  return (
    <div className="p-4">
      <Button onClick={generatePDF} className="mb-0">
        Download Defect Product Report
      </Button>
    </div>
  );
};

export default DefectProductReportPDF;
