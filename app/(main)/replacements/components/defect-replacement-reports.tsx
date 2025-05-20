"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { format, subMonths, isAfter, isBefore, parseISO } from "date-fns";
import { addHeader, addFooter } from "../../sales-orders/utils/inventory";
import { getReplacementReports } from "@/lib/actions/replacement-actions";

interface DefectSalesReportPDFProps {
  startDate: string | undefined;
  endDate: string | undefined;
}

const DefectReplacementReports = ({
  startDate,
  endDate,
}: DefectSalesReportPDFProps) => {
  const [defectData, setDefectData] = useState<any>();

  useEffect(() => {
    if (!startDate && !endDate) return;

    const fetchDefectData = async () => {
      const replacements = await getReplacementReports();
      setDefectData(replacements.data);
    };

    fetchDefectData();
  }, [startDate, endDate]);

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const leftMargin = 50;
    const date = new Date();

    let pages: any[] = [];

    const createNewPage = async (title: string): Promise<any> => {
      const page = pdfDoc.addPage([600, 800]);
      pages.push(page);
      const { height } = page.getSize();

      await addHeader(page, {
        title,
        companyName: "Happy Feet and Apparel",
        logoPath: "/logo.png",
        logoWidth: 50,
        logoHeight: 50,
      });

      return { page, y: height - 170 };
    };

    // --- Page 1+ for Itemized Details ---
    let { page: currentPage, y } = await createNewPage(
      `Replacement Sales Report - ${date.getFullYear()}`
    );

    currentPage.drawText("Item/SKU/Code", { x: leftMargin, y, size: 12, font });
    currentPage.drawText("Item Name", { x: 150, y, size: 12, font });
    currentPage.drawText("Status", { x: 300, y, size: 12, font });
    currentPage.drawText("Date", { x: 400, y, size: 12, font });
    currentPage.drawText("Name", { x: 500, y, size: 12, font });

    y -= 15;
    currentPage.drawLine({
      start: { x: leftMargin, y },
      end: { x: 550, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= 15;

    const filteredReplacements = (defectData?.replacements || []).filter(
      (item: any) => {
        const itemDate = parseISO(item.date);
        return (
          (!startDate || !isBefore(itemDate, parseISO(startDate))) &&
          (!endDate || !isAfter(itemDate, parseISO(endDate)))
        );
      }
    );

    for (const item of filteredReplacements) {
      if (y < 60) {
        await addFooter(currentPage, {
          companyName: "Happy Feet and Apparel",
          website: "www.happyfeetandapparel.com",
          email: "contact@happyfeetandapparel.com",
          phone: "(123) 456-7890",
          pageNumber: pages.length,
          totalPages: 0,
        });

        ({ page: currentPage, y } = await createNewPage(
          `Replacement Sales Report - ${date.getFullYear()}`
        ));

        currentPage.drawText("Item/SKU/Code", {
          x: leftMargin,
          y,
          size: 12,
          font,
        });
        currentPage.drawText("Item Name", { x: 150, y, size: 12, font });
        currentPage.drawText("Status", { x: 300, y, size: 12, font });
        currentPage.drawText("Date", { x: 400, y, size: 12, font });
        currentPage.drawText("Name", { x: 500, y, size: 12, font });

        y -= 15;
        currentPage.drawLine({
          start: { x: leftMargin, y },
          end: { x: 550, y },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        y -= 15;
      }

      currentPage.drawText(item.sku, { x: leftMargin, y, size: 10, font });
      currentPage.drawText(item.item_name, { x: 150, y, size: 10, font });
      currentPage.drawText(item.status, { x: 300, y, size: 10, font });
      currentPage.drawText(item.date, { x: 400, y, size: 10, font });
      currentPage.drawText(item.name, { x: 500, y, size: 10, font });

      y -= 15;
    }

    await addFooter(currentPage, {
      companyName: "Happy Feet and Apparel",
      website: "www.happyfeetandapparel.com",
      email: "contact@happyfeetandapparel.com",
      phone: "(123) 456-7890",
      pageNumber: pages.length,
      totalPages: 0,
    });

    // --- New Page(s) for Monthly Summary ---
    ({ page: currentPage, y } = await createNewPage(
      `Replacement Sales Summary - ${date.getFullYear()}`
    ));

    currentPage.drawText("Month", { x: leftMargin, y, size: 12, font });
    currentPage.drawText("Damaged", { x: 150, y, size: 12, font });
    currentPage.drawText("Defective", { x: 250, y, size: 12, font });
    currentPage.drawText("Wrong Item", { x: 350, y, size: 12, font });
    currentPage.drawText("Other", { x: 450, y, size: 12, font });

    y -= 15;
    currentPage.drawLine({
      start: { x: leftMargin, y },
      end: { x: 550, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= 15;

    for (const item of defectData?.months || []) {
      if (y < 60) {
        await addFooter(currentPage, {
          companyName: "Happy Feet and Apparel",
          website: "www.happyfeetandapparel.com",
          email: "contact@happyfeetandapparel.com",
          phone: "(123) 456-7890",
          pageNumber: pages.length,
          totalPages: 0,
        });

        ({ page: currentPage, y } = await createNewPage(
          `Replacement Sales Summary - ${date.getFullYear()}`
        ));

        currentPage.drawText("Month", { x: leftMargin, y, size: 12, font });
        currentPage.drawText("Damaged", { x: 150, y, size: 12, font });
        currentPage.drawText("Defective", { x: 250, y, size: 12, font });
        currentPage.drawText("Wrong Item", { x: 350, y, size: 12, font });
        currentPage.drawText("Other", { x: 450, y, size: 12, font });

        y -= 15;
        currentPage.drawLine({
          start: { x: leftMargin, y },
          end: { x: 550, y },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        y -= 15;
      }

      currentPage.drawText(item.month, { x: leftMargin, y, size: 10, font });
      currentPage.drawText(String(item.Damaged), { x: 150, y, size: 10, font });
      currentPage.drawText(String(item.Defective), {
        x: 250,
        y,
        size: 10,
        font,
      });
      currentPage.drawText(String(item["Wrong Item"]), {
        x: 350,
        y,
        size: 10,
        font,
      });
      currentPage.drawText(String(item.Other), { x: 450, y, size: 10, font });

      y -= 15;
    }

    await addFooter(currentPage, {
      companyName: "Happy Feet and Apparel",
      website: "www.happyfeetandapparel.com",
      email: "contact@happyfeetandapparel.com",
      phone: "(123) 456-7890",
      pageNumber: pages.length,
      totalPages: 0,
    });

    const totalPages = pages.length;
    for (let i = 0; i < totalPages; i++) {
      await addFooter(pages[i], {
        companyName: "Happy Feet and Apparel",
        website: "www.happyfeetandapparel.com",
        email: "contact@happyfeetandapparel.com",
        phone: "(123) 456-7890",
        pageNumber: i + 1,
        totalPages,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Replacement_Sales_Report_${format(
      subMonths(new Date(), 1),
      "yyyy-MM"
    )}.pdf`;
    link.click();
  };

  return (
    <div className="p-4">
      <Button onClick={generatePDF} className="mb-0">
        Download Replacement Reports
      </Button>
    </div>
  );
};

export default DefectReplacementReports;
