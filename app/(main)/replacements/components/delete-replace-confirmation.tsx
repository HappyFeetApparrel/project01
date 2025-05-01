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

interface DeleteReplaceConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  replaceName: string;
  loadingDeleteReplace: boolean;
}

export function DeleteReplaceConfirmation({
  isOpen,
  onClose,
  onConfirm,
  replaceName,
  loadingDeleteReplace,
}: DeleteReplaceConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete the replace {replaceName}? This
            action cannot be undone.
          </p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            disabled={loadingDeleteReplace}
            className="flex-1"
            variant="destructive"
            onClick={onConfirm}
          >
            <span className={`${loadingDeleteReplace ? "hidden" : "block"}`}>
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
              wrapperClass={`${loadingDeleteReplace ? "block" : "!hidden"}`}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
