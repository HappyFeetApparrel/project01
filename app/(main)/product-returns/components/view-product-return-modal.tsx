"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductReturn } from "@/prisma/type";

interface ViewProductReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  productReturn: ProductReturn;
}

export function ViewProductReturnModal({
  isOpen,
  onClose,
  productReturn,
}: ViewProductReturnModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>ProductReturn Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <dl className="grid grid-cols-1 gap-4">
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Name:</dt>
              <dd>{productReturn.name}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Contact Person:</dt>
              <dd>{productReturn.description || "N/A"}</dd>
            </div>
          </dl>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="min-w-[50%]">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
