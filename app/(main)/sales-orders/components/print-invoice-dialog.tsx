"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Updated OrderData interface to match your data structure
interface Product {
  product_id: number;
  name: string;
  unit_price: number;
  discount: number;
  category: {
    name: string;
  };
}

import { OrderData } from "./place-order-dialog";

interface OrderItem {
  product: Product;
  quantity_in_stock: number;
}

// interface OrderData {
//   paymentMethod: number
//   amountGiven: number
//   user_id: number
//   items: OrderItem[]
//   totalAmount: number
//   change: number
//   orderDate: string | Date
// }

interface PrintInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderData | null;
  orderCode: string;
}

export function PrintInvoiceDialog({
  isOpen,
  onClose,
  orderData,
  orderCode,
}: PrintInvoiceDialogProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const invoiceRef = useRef(null);
  console.log(orderData);
  // Helper function to get payment method name
  const getPaymentMethodName = (code: number): string => {
    const methods: Record<number, string> = {
      1: "Cash",
      200: "Credit Card",
      300: "Debit Card",
      400: "Mobile Payment",
      500: "Bank Transfer",
    };
    return methods[code] || "Other";
  };

  const handlePrint = async () => {
    if (!invoiceRef.current) return;
    setIsPrinting(true);

    try {
      // Capture the receipt content
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // Create PDF with proper dimensions for a receipt
      const pdfWidth = 80; // 80mm width (standard receipt width)
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Create PDF with mm units
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight + 10], // Add some margin at the bottom
      });

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Auto print and open in new window
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }

    setIsPrinting(false);
    onClose();
  };

  // Calculate subtotal and tax
  // const subtotal = orderData?.totalAmount ? orderData.totalAmount / 1.09 : 0 // Assuming 9% tax
  // const taxAmount = orderData?.totalAmount ? orderData.totalAmount - subtotal : 0

  const VAT_RATE = 0.12;
  const calculateTotal = () => {
    if (!orderData) {
      return { subtotal: 0, discountAmount: 0, totalAfterDiscount: 0 };
    }

    const subtotal = orderData?.items.reduce((total, item) => {
      return total + item.product.unit_price * item.quantity_in_stock;
    }, 0);

    const discountAmount = (subtotal * orderData?.discountPercentage) / 100;
    const totalAfterDiscount = subtotal - discountAmount;

    return {
      subtotal,
      discountAmount,
      totalAfterDiscount,
    };
  };

  const { subtotal, discountAmount, totalAfterDiscount } = calculateTotal();

  // Format date for receipt
  const formattedDate = orderData?.orderDate
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(orderData.orderDate))
    : "";

  // Format time for receipt
  const formattedTime = orderData?.orderDate
    ? new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date(orderData.orderDate))
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle>Print Invoice</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="px-6 mb-4">
            Would you like to print an invoice for this order?
          </p>

          {/* POS Receipt Layout */}
          <div
            className="border rounded p-4 bg-white mx-auto font-mono text-sm w-[300px]"
            ref={invoiceRef}
            style={{ minHeight: "200px" }}
          >
            {/* Company Header */}
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold">Happy Feet & Apparel</h1>
              <p>A. Aguilar</p>
              <p>8709 Valencia, Philippines</p>
              <p>Tax No.: 123456789</p>
              <p>+1 234 567 890</p>
              <p>office@aronium.com</p>
            </div>

            {/* Receipt Info */}
            <div className="mb-4">
              <p>Receipt No.: {orderCode}</p>
              <p>
                {formattedDate}, {formattedTime}
              </p>
              <p>User Name: {orderData?.name || "Unknown"}</p>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-300 my-2"></div>

            {/* Items */}
            <div className="mb-4">
              {orderData?.items.map((item, index) => {
                // @ts-ignore
                // const discountAmount = item.product.unit_price * (item.product.discount / 100)
                // const priceAfterDiscount = item.product.unit_price - discountAmount
                // const totalPrice = priceAfterDiscount * item.quantity_in_stock
                const totalPrice = item.product.unit_price;

                return (
                  <div key={index} className="flex justify-between mb-2">
                    <div>
                      <p>{item.product.name}</p>
                      <p className="text-xs">
                        {/* {item.quantity_in_stock}x ₱{item.product.unit_price.toFixed(2)} */}
                        {/* @ts-ignore */}
                        {/* {item.product.discount > 0 && ` (-${item.product.discount.toFixed(1)}%)`} */}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>₱{totalPrice.toFixed(2)}</p>
                      {/* @ts-ignore */}
                      <p className="text-xs">{item.product.category.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div>
              <p>Items count: {orderData?.items.length || 0}</p>
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>₱{subtotal.toFixed(2) || "0.00"}</p>
              </div>
              {orderData && orderData?.discountPercentage > 0 && (
                <div className="flex justify-between">
                  <span>Discount ({`${orderData?.discountPercentage}%`}):</span>
                  <p>₱{discountAmount.toFixed(2) || "0.00"}</p>
                </div>
              )}
              <div className="flex justify-between font-bold mt-2">
                <p>TOTAL:</p>
                {/* @ts-ignore */}
                <p clas>₱{totalAfterDiscount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                {/* @ts-ignore */}
                <p>Payment Method:</p>
                {/* @ts-ignore */}
                <p>{getPaymentMethodName(orderData?.paymentMethod || 0)}</p>
              </div>
              <div className="flex justify-between">
                <p>Paid amount:</p>
                {/* @ts-ignore */}
                <p>₱{orderData?.amountGiven.toFixed(2) || "0.00"}</p>
              </div>
              <div className="flex justify-between">
                <p>Change:</p>
                <p>₱{orderData?.change.toFixed(2) || "0.00"}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="pb-6 px-6">
          <Button variant="outline" onClick={onClose}>
            No, Thanks!
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? "Printing..." : "Print Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
