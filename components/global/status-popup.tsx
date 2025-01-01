"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface StatusPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  status: "success" | "error";
}

export function StatusPopup({
  isOpen,
  onClose,
  message,
  status,
}: StatusPopupProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex items-center space-x-2">
          {status === "success" ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
          <p
            className={status === "success" ? "text-green-700" : "text-red-700"}
          >
            {message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
