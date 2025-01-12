"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/prisma/type";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function ViewProductModal({
  isOpen,
  onClose,
  product,
}: ViewProductModalProps) {
  const formatDate = (date?: Date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-full p-4 overflow-auto h-1/2">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1">
              <dt className="font-semibold">Name:</dt>
              <dd>{product.name}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Description:</dt>
              <dd>{product.description || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Category ID:</dt>
              <dd>{product.category_id || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Barcode:</dt>
              <dd>{product.barcode || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Quantity in Stock:</dt>
              <dd>{product.quantity_in_stock}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Reorder Level:</dt>
              <dd>{product.reorder_level}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Unit Price:</dt>
              <dd>{product.unit_price}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Cost Price:</dt>
              <dd>{product.cost_price}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Status:</dt>
              <dd>{product.status}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Supplier:</dt>
              <dd>{product.supplier?.name || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Date of Entry:</dt>
              <dd>{formatDate(product.date_of_entry)}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Size:</dt>
              <dd>{product.size || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Color:</dt>
              <dd>{product.color || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Material:</dt>
              <dd>{product.material || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Style/Design:</dt>
              <dd>{product.style_design || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Product Image:</dt>
              <dd>
                {product.product_image ? (
                  <img
                    src={product.product_image}
                    alt="Product"
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  "N/A"
                )}
              </dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Dimensions:</dt>
              <dd>{product.dimensions || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Weight:</dt>
              <dd>{product.weight || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Brand:</dt>
              <dd>{product.brand || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Season:</dt>
              <dd>{product.season || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Expiration Date:</dt>
              <dd>{formatDate(product.expiration_date)}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Location:</dt>
              <dd>{product.location || "N/A"}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Discount:</dt>
              <dd>{product.discount ? `${product.discount}%` : "N/A"}</dd>
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
