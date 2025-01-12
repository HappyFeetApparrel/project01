"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteUserConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  supplierName: string;
}

export function DeleteUserConfirmation({
  isOpen,
  onClose,
  onConfirm,
  supplierName,
}: DeleteUserConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete the supplier {supplierName}? This
            action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
