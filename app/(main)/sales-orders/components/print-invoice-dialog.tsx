"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OrderData from "../types/order-data";

interface PrintInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderData | null; // Replace 'any' with a proper type for your order data
}

export function PrintInvoiceDialog({
  isOpen,
  onClose,
  orderData,
}: PrintInvoiceDialogProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    // Simulate printing process
    setTimeout(() => {
      setIsPrinting(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Print Invoice</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Would you like to print an invoice for this order?</p>
          <div className="mt-4 border rounded p-4">
            <h3 className="font-bold">Order Summary</h3>
            {orderData && (
              <div>
                <p>Total Amount: ${orderData.totalAmount.toFixed(2)}</p>
                <p>Items: {orderData.items.length}</p>
                <p>Date: {orderData.orderDate.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? "Printing..." : "Print Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
