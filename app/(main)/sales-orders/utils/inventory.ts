import { Product } from "@/data/product";
import { getLogoBytes } from "@/app/pdf-generator/action";
// This would typically be a database call
let inventory: Product[] = [
  {
    productId: "PROD001",
    name: "Macbook Pro",
    description: "Latest model Macbook Pro",
    category: "Laptop",
    sku: "MAC001",
    barcode: "123456789",
    quantity: 50,
    reorderLevel: 10,
    unitPrice: 1299.99,
    costPrice: 999.99,
    supplier: "Apple Inc",
    dateOfEntry: new Date(),
    size: "15-inch",
    color: "Space Gray",
    material: "Aluminum",
    style: "Professional",
    brand: "Apple",
    season: "All Season",
    status: "In Stock",
    location: "Warehouse A",
    discount: 0,
    image: "/placeholder.svg",
  },
  {
    productId: "PROD002",
    name: "iPhone 13",
    description: "Latest iPhone model",
    category: "Smartphone",
    sku: "IPH002",
    barcode: "987654321",
    quantity: 100,
    reorderLevel: 20,
    unitPrice: 999.99,
    costPrice: 699.99,
    supplier: "Apple Inc",
    dateOfEntry: new Date(),
    size: "6.1-inch",
    color: "Midnight",
    material: "Glass and Aluminum",
    style: "Modern",
    brand: "Apple",
    season: "All Season",
    status: "In Stock",
    location: "Warehouse B",
    discount: 5,
    image: "/placeholder.svg",
  },
];

export function getInventory(): Product[] {
  return inventory;
}

export function updateInventory(
  orderedItems: { productId: string; quantity: number }[]
): void {
  inventory = inventory.map((product) => {
    const orderedItem = orderedItems.find(
      (item) => item.productId === product.productId
    );
    if (orderedItem) {
      return {
        ...product,
        quantity: product.quantity - orderedItem.quantity,
      };
    }
    return product;
  });
}

import {
  PDFDocument,
  PDFPage,
  rgb,
  StandardFonts,
  RGB,
  PDFImage,
} from "pdf-lib";

// Define types for better type safety
interface HeaderOptions {
  title: string;
  companyName?: string;
  date?: string;
  logoPath?: string; // Path to the logo image file
  logoWidth?: number; // Width to display the logo
  logoHeight?: number; // Height to display the logo
}

interface FooterOptions {
  companyName?: string;
  website?: string;
  email?: string;
  phone?: string;
  pageNumber?: number;
  totalPages?: number;
}

interface StyleOptions {
  primaryColor?: RGB;
  accentColor?: RGB;
  textColor?: RGB;
  backgroundColor?: RGB;
}

/**
 * Adds a header with an image logo to a PDF page
 * @param page - The PDF page to add the header to
 * @param options - Header options including logo path
 * @param styleOptions - Style options for colors
 * @returns The Y position where content can start
 */
export async function addHeader(
  page: PDFPage,
  options: HeaderOptions,
  styleOptions?: StyleOptions
): Promise<number> {
  const { width, height } = page.getSize();
  const margin = 50;
  const headerHeight = 100;
  // Default values
  const title = options.title || "Document Title";
  const companyName = options.companyName || "Happy Feet and Apparel";
  const date = options.date || new Date().toLocaleDateString();
  const logoWidth = options.logoWidth || 40;
  const logoHeight = options.logoHeight || 40;

  // Default colors
  const primaryColor = styleOptions?.primaryColor || rgb(0.2, 0.4, 0.6); // Blue shade
  const textColor = styleOptions?.textColor || rgb(0.1, 0.1, 0.1); // Near black
  const backgroundColor =
    styleOptions?.backgroundColor || rgb(0.95, 0.95, 0.95); // Light gray

  // Get the document from the page
  const pdfDoc = page.doc;

  // Embed fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Header background
  page.drawRectangle({
    x: 0,
    y: height - headerHeight,
    width: width,
    height: headerHeight,
    color: backgroundColor,
  });

  // Logo position in header
  const logoX = margin;
  const logoY = height - headerHeight / 2 - logoHeight / 2;

  // Embed and draw logo if provided
  let companyNameX = margin; // Default position if no logo

  if (options.logoPath) {
    try {
      const logoBytes = await getLogoBytes("logo.png");

      if (logoBytes) {
        const logoImage = await pdfDoc.embedPng(logoBytes); // NOW it's allowed, client side!

        if (logoImage) {
          page.drawImage(logoImage, {
            x: logoX,
            y: logoY,
            width: logoWidth,
            height: logoHeight,
          });

          // Adjust company name position to be after the logo
          companyNameX = logoX + logoWidth + 15;
        }
      }
    } catch (error) {
      console.error("Error embedding logo:", error);
      // If logo fails to load, we'll continue without it
    }
  }

  // Company name - positioned after the logo
  page.drawText(companyName, {
    x: companyNameX,
    y: height - headerHeight / 2 + -10, // Vertically centered in header
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });

  // Horizontal line under header
  page.drawLine({
    start: { x: margin, y: height - headerHeight - 10 },
    end: { x: width - margin, y: height - headerHeight - 10 },
    thickness: 2,
    color: primaryColor,
  });

  // Document title
  page.drawText(title, {
    x: margin,
    y: height - headerHeight - 40,
    size: 16,
    font: helveticaBold,
    color: textColor,
  });

  // Optional: Add date in the top right
  const dateText = `Date: ${date}`;
  const dateWidth = helvetica.widthOfTextAtSize(dateText, 10);

  page.drawText(dateText, {
    x: width - margin - dateWidth,
    y: height - headerHeight - 40,
    size: 10,
    font: helvetica,
    color: textColor,
  });

  // Return the Y position where content can start
  return height - headerHeight - 70;
}

/**
 * Adds a footer to a PDF page
 * @param page - The PDF page to add the footer to
 * @param options - Footer options
 * @param styleOptions - Style options for colors
 * @returns The Y position where content should end
 */
export async function addFooter(
  page: PDFPage,
  options: FooterOptions,
  styleOptions?: StyleOptions
): Promise<number> {
  const { width, height } = page.getSize();
  const margin = 50;
  const footerHeight = 80;

  // Default values
  const companyName = options.companyName || "Happy Feet and Apparel";
  const website = options.website || "www.happyfeetapparel.com";
  const email = options.email || "support@happyfeetapparel.com";
  const phone = options.phone || "(555) 123-4567";
  const pageNumber = options.pageNumber || 1;
  const totalPages = options.totalPages || 1;

  // Default colors
  const primaryColor = styleOptions?.primaryColor || rgb(0.2, 0.4, 0.6);
  const textColor = styleOptions?.textColor || rgb(0.1, 0.1, 0.1);

  // Get the document from the page
  const pdfDoc = page.doc;

  // Embed font
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Footer line
  page.drawLine({
    start: { x: margin, y: footerHeight },
    end: { x: width - margin, y: footerHeight },
    thickness: 1,
    color: primaryColor,
  });

  // Footer text
  page.drawText(`${companyName}`, {
    x: margin,
    y: footerHeight - 20,
    size: 10,
    font: helvetica,
    color: textColor,
  });

  // Contact info
  page.drawText(`${website} | ${email} | ${phone}`, {
    x: margin,
    y: footerHeight - 35,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  // Page number
  page.drawText(`Page ${pageNumber} of ${totalPages}`, {
    x: width - margin - 60,
    y: footerHeight - 35,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  // Current date
  const today = new Date().toISOString().split("T")[0];
  page.drawText(`Generated: ${today}`, {
    x: width - margin - 100,
    y: footerHeight - 20,
    size: 9,
    font: helvetica,
    color: textColor,
  });

  // Return the Y position where content should end
  return footerHeight + 10;
}
