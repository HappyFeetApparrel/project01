"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Returns } from "@/prisma/type";

interface ProductReturnCustom extends Returns {
  name: string;
  type: string;
  quantity: number;
  reason: string;
}

interface ViewProductReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  returns: ProductReturnCustom;
}

export function ViewProductReturnModal({
  isOpen,
  onClose,
  returns,
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
              <dd>{returns.name}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Type:</dt>
              <dd>{returns.type || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Quantity:</dt>
              <dd>{returns.quantity || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Reason:</dt>
              <dd>{returns.reason || "N/A"}</dd>
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
