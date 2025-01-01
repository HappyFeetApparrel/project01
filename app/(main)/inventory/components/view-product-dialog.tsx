"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { format } from "date-fns";

interface Product {
  productId: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  barcode?: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  dateOfEntry: Date;
  size?: string;
  color?: string;
  material?: string;
  style?: string;
  brand: string;
  season?: string;
  status: string;
  location: string;
  discount?: number;
}

export function ViewProductDialog({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View product details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Detailed information about {product.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Product ID</p>
            <p className="text-sm text-muted-foreground">{product.productId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Name</p>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Category</p>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Brand</p>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">SKU</p>
            <p className="text-sm text-muted-foreground">{product.sku}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Barcode</p>
            <p className="text-sm text-muted-foreground">
              {product.barcode || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Quantity in Stock</p>
            <p className="text-sm text-muted-foreground">{product.quantity}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Reorder Level</p>
            <p className="text-sm text-muted-foreground">
              {product.reorderLevel}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Unit Price</p>
            <p className="text-sm text-muted-foreground">
              ${product.unitPrice}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Cost Price</p>
            <p className="text-sm text-muted-foreground">
              ${product.costPrice}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Supplier</p>
            <p className="text-sm text-muted-foreground">{product.supplier}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Date of Entry</p>
            <p className="text-sm text-muted-foreground">
              {format(product.dateOfEntry, "PPP")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Size</p>
            <p className="text-sm text-muted-foreground">
              {product.size || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Color</p>
            <p className="text-sm text-muted-foreground">
              {product.color || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Material</p>
            <p className="text-sm text-muted-foreground">
              {product.material || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Style</p>
            <p className="text-sm text-muted-foreground">
              {product.style || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Season</p>
            <p className="text-sm text-muted-foreground">
              {product.season || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground">{product.status}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">{product.location}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Discount</p>
            <p className="text-sm text-muted-foreground">
              {product.discount ? `${product.discount}%` : "No discount"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
