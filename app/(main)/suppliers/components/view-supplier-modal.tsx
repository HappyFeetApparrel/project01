"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Supplier } from "../types/supplier";

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supplier Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <dl className="grid grid-cols-3 gap-4">
            <dt className="font-semibold">Name:</dt>
            <dd className="col-span-2">{supplier.name}</dd>

            <dt className="font-semibold">Contact Person:</dt>
            <dd className="col-span-2">{supplier.contactPerson}</dd>

            <dt className="font-semibold">Phone Number:</dt>
            <dd className="col-span-2">{supplier.phoneNumber}</dd>

            <dt className="font-semibold">Email Address:</dt>
            <dd className="col-span-2">{supplier.emailAddress}</dd>

            <dt className="font-semibold">Address:</dt>
            <dd className="col-span-2">{supplier.address}</dd>

            <dt className="font-semibold">Supplied Products:</dt>
            <dd className="col-span-2">
              {supplier.suppliedProducts.join(", ")}
            </dd>
          </dl>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
