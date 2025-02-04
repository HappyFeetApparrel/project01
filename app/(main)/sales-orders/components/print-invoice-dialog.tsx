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
import { OrderData } from "./place-order-dialog";

interface PrintInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderData | null;
}

export function PrintInvoiceDialog({
  isOpen,
  onClose,
  orderData,
}: PrintInvoiceDialogProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const invoiceRef = useRef(null);

  const handlePrint = async () => {
    if (!invoiceRef.current) return;
    setIsPrinting(true);

    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.autoPrint();
    window.open(pdf.output("bloburl"), "_blank");

    setIsPrinting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle>Print Invoice</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="px-6">
            Would you like to print an invoice for this order?
          </p>
          <div className="border rounded p-4 bg-white m-6" ref={invoiceRef}>
            <h3 className="font-bold">Order Summary</h3>
            {orderData && (
              <div>
                <p>Total Amount: ₱{orderData.totalAmount.toFixed(2)}</p>
                <p>
                  Item{orderData.items.length > 0 ? "s" : ""}:{" "}
                  {orderData.items.length}
                </p>
                <p>Date: {orderData.orderDate.toLocaleString()}</p>
              </div>
            )}
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
