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
import { Product } from "@/prisma/type";

interface DeleteProductConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product) => void;
  product: Product;
  loadingDeleteProduct: boolean;
}

export function DeleteProductConfirmation({
  isOpen,
  onClose,
  onConfirm,
  product,
  loadingDeleteProduct,
}: DeleteProductConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete the product{" "}
            <strong>{product.name}</strong>? This action cannot be undone.
          </p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            disabled={loadingDeleteProduct}
            className="flex-1"
            variant="destructive"
            onClick={() => onConfirm(product)}
          >
            <span className={`${loadingDeleteProduct ? "hidden" : "block"}`}>
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
              wrapperClass={`${loadingDeleteProduct ? "block" : "!hidden"}`}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
