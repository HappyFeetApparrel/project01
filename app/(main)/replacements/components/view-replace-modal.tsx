"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Replace } from "@/prisma/type";

interface ReplaceCustom extends Replace {
  name: string;
  type: string;
  quantity: number;
  reason: string;
}

interface ViewReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  replace: ReplaceCustom;
}

export function ViewReplaceModal({
  isOpen,
  onClose,
  replace,
}: ViewReplaceModalProps) {
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
              <dd>{replace.name}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Type:</dt>
              <dd>{replace.type || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Quantity:</dt>
              <dd>{replace.quantity || "N/A"}</dd>
            </div>
            <div className="col-span-1 span-y-4">
              <dt className="font-semibold">Reason:</dt>
              <dd>{replace.reason || "N/A"}</dd>
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
