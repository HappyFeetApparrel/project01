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

interface ProductReturnCustom extends ProductReturn {
  name: string;
  type: string;
  quantity: number;
  reason: string;
}

interface ViewProductReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  productReturn: ProductReturnCustom;
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
          <DialogTitle>Product Return Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <dl className="grid grid-cols-1 gap-4">
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Name:</dt>
              <dd>{productReturn.name}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Type:</dt>
              <dd>{productReturn.type || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Quantity:</dt>
              <dd>{productReturn.quantity || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Reason:</dt>
              <dd>{productReturn.reason || "N/A"}</dd>
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
