"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/prisma/type";

interface ViewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
}

export function ViewSupplierModal({
  isOpen,
  onClose,
  supplier,
}: ViewSupplierModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Supplier Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <dl className="grid grid-cols-2 gap-4">
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Name:</dt>
              <dd>{supplier.name}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Contact Person:</dt>
              <dd>{supplier.contact_person || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Phone Number:</dt>
              <dd>{supplier.phone_number || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Email Address:</dt>
              <dd>{supplier.email_address || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Address:</dt>
              <dd>{supplier.address || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Supplied Products:</dt>
              <dd>{supplier.supplied_products || "N/A"}</dd>
            </div>
          </dl>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
