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

interface DeleteBrandConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  brandName: string;
  loadingDeleteBrand: boolean;
}

export function DeleteBrandConfirmation({
  isOpen,
  onClose,
  onConfirm,
  brandName,
  loadingDeleteBrand,
}: DeleteBrandConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete the brand {brandName}? This action
            cannot be undone.
          </p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            disabled={loadingDeleteBrand}
            className="flex-1"
            variant="destructive"
            onClick={onConfirm}
          >
            <span className={`${loadingDeleteBrand ? "hidden" : "block"}`}>
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
              wrapperClass={`${loadingDeleteBrand ? "block" : "!hidden"}`}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
