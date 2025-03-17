"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ThreeDots } from "react-loader-spinner";

interface DeleteProductReturnConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productReturnName: string;
  loadingDeleteProductReturn: boolean;
}

export function DeleteProductReturnConfirmation({
  isOpen,
  onClose,
  onConfirm,
  productReturnName,
  loadingDeleteProductReturn,
}: DeleteProductReturnConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete the productReturn {productReturnName}? This action
            cannot be undone.
          </p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            disabled={loadingDeleteProductReturn}
            className="flex-1"
            variant="destructive"
            onClick={onConfirm}
          >
            <span className={`${loadingDeleteProductReturn ? "hidden" : "block"}`}>
              Delete
            </span>
            <ThreeDots
              visible={true}
              height="50"
              width="50"
              color="#fff"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass={`${loadingDeleteProductReturn ? "block" : "!hidden"}`}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
