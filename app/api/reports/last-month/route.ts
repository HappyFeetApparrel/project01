import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import {
  addHeader,
  addFooter,
} from "@/app/(main)/sales-orders/utils/inventory";
import { SalesOrder } from "@/prisma/type";

// Function to fetch last month's sales dynamically
async function getLastMonthSales() {
  const lastMonth = subMonths(new Date(), 1);
  const startDate = startOfMonth(lastMonth);
  const endDate = endOfMonth(lastMonth);

  return await prisma.salesOrder.findMany({
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: true,
      order_items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

// Function to generate the PDF sales report
async function generateSalesReportPDF(
  sales: SalesOrder[],
  reportMonth: string,
  reportDateRange: string
) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;

  await addHeader(page, {
    title: `Reports for Last Month - From ${reportDateRange}`,
    companyName: "Happy Feet and Apparel",
    logoPath: "/logo.png",
    logoWidth: 50, // Adjust as needed
    logoHeight: 50, // Adjust as needed
  });

  // Table Header
  y -= 120;
  const colX = [50, 180, 280, 400]; // Column positions

  page.drawText("Order Code", { x: colX[0], y, size: 10, font: boldFont });
  page.drawText("Customer", { x: colX[1], y, size: 10, font: boldFont });
  page.drawText("Total Price", { x: colX[2], y, size: 10, font: boldFont });
  page.drawText("Date", { x: colX[3], y, size: 10, font: boldFont });

  y -= 10;
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Table Content
  y -= 20;
  sales.forEach((sale) => {
    page.drawText(sale.order_code, { x: colX[0], y, size: 10, font });
    page.drawText(sale.user?.name || "Guest", {
      x: colX[1],
      y,
      size: 10,
      font,
    });
    page.drawText(`PHP${sale.total_price.toFixed(2)}`, {
      x: colX[2],
      y,
      size: 10,
      font,
    });
    page.drawText(format(sale.created_at, "yyyy-MM-dd"), {
      x: colX[3],
      y,
      size: 10,
      font,
    });
    y -= 20;
  });

  await addFooter(page, {
    companyName: "Happy Feet and Apparel",
    website: "www.happyfeetandapparel.com",
    email: "contact@happyfeetandapparel.com",
    phone: "(123) 456-7890",
    pageNumber: 1,
    totalPages: 1,
  });

  return await pdfDoc.save();
}

// API Handler
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const sales = await getLastMonthSales();

    if (!sales.length) {
      return NextResponse.json(
        { error: "No sales data available for last month" },
        { status: 404 }
      );
    }

    const lastMonth = subMonths(new Date(), 1);
    const reportMonth = format(lastMonth, "MMMM yyyy");
    const reportDateRange = `From ${format(startOfMonth(lastMonth), "dd MMM")} - ${format(endOfMonth(lastMonth), "dd MMM")}`;
    const pdfBytes = await generateSalesReportPDF(
      // @ts-expect-error it has error
      sales,
      reportMonth,
      reportDateRange
    );
    const pdfBuffer = Buffer.from(pdfBytes);

    // Detect if the request is for viewing or downloading
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          mode === "view"
            ? "inline" // View in browser
            : `attachment; filename="Sales_Report_${reportMonth}.pdf"`, // Force download
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
