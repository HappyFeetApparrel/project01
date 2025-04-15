"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button"; // Replace with your own button component

interface Product {
  name: string;
  category?: { name: string };
  quantity_in_stock: number;
  unit_price: number;
  status: string;
}

const InventoryReportPDF = () => {
  const [inventory, setInventory] = useState<Product[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const response = await fetch("/api/inventory-report");
      const data = await response.json();
      setInventory(data);
    };
    fetchInventory();
  }, []);

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;
    const leftMargin = 50;

    // Generate Timestamp
    const now = new Date();
    const timestamp = now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

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

    // Title with Timestamp
    const title = `Inventory Report - ${timestamp}`;

    page.drawText(title, {
      x: leftMargin,
      y,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 30;

    // Table Headers
    page.drawText("Product Name", { x: leftMargin, y, size: 12, font });
    page.drawText("Category", { x: 200, y, size: 12, font });
    page.drawText("Stock", { x: 330, y, size: 12, font });
    page.drawText("Price", { x: 400, y, size: 12, font });
    page.drawText("Availability", { x: 470, y, size: 12, font });

    y -= 15;

    // Draw a line under headers
    page.drawLine({
      start: { x: leftMargin, y },
      end: { x: width - leftMargin, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= 15;

    // Add products data
    inventory.forEach((product) => {
      if (y < 50) return;

      page.drawText(product.name, { x: leftMargin, y, size: 10, font });
      page.drawText(product.category?.name || "N/A", {
        x: 200,
        y,
        size: 10,
        font,
      });
      page.drawText(product.quantity_in_stock.toString(), {
        x: 330,
        y,
        size: 10,
        font,
      });
      page.drawText(`PHP${product.unit_price.toFixed(2)}`, {
        x: 400,
        y,
        size: 10,
        font,
      });
      page.drawText(product.status, { x: 470, y, size: 10, font });

      y -= 15;
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Inventory_Report_${now.toISOString().slice(0, 19).replace(/:/g, "-")}.pdf`; // Timestamp in filename
    link.click();
  };

  return (
    <div className="p-4">
      <Button onClick={generatePDF} className="mb-4">
        Download Report
      </Button>
    </div>
  );
};

export default InventoryReportPDF;
