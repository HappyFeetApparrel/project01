"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brand } from "@/prisma/type";

interface ViewBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand;
}

export function ViewBrandModal({
  isOpen,
  onClose,
  brand,
}: ViewBrandModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Brand Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <dl className="grid grid-cols-1 gap-4">
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Name:</dt>
              <dd>{brand.name}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Contact Person:</dt>
              <dd>{brand.description || "N/A"}</dd>
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
