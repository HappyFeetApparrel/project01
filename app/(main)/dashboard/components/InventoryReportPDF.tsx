"use client";

import { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button"; // Replace with your own button component
import { addHeader, addFooter } from "../../sales-orders/utils/inventory";

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

    // Add header with logo
    await addHeader(page, {
      title: `Inventory Report`,
      companyName: "Happy Feet and Apparel",
      logoPath: "/logo.png",
      logoWidth: 50, // Adjust as needed
      logoHeight: 50, // Adjust as needed
    });

    y -= 120;

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
