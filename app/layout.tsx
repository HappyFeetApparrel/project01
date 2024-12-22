import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"], // Choose subsets you need (e.g., 'latin', 'latin-ext')
  weight: ["400", "700"], // Add desired weights (optional)
});

export const metadata: Metadata = {
  title: "Happy Feet and Apparel",
  description:
    "A Point of Sale and Inventory Management System of Happy Feet and Apparel.",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
