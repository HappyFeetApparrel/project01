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

import Image from "next/image";
import { Product } from "@/prisma/type";

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
          <div className="space-y-1 col-span-2">
            <Image
              src={`https://picsum.photos/seed/${Math.random()
                .toString(36)
                .substring(2, 8)}/2428/2447`}
              alt={product.name}
              width={200}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Product ID</p>
            <p className="text-sm text-muted-foreground">
              {product.product_id}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Name</p>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground">
              {product.description || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Category</p>
            <p className="text-sm text-muted-foreground">
              {product.category?.name || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Brand</p>
            <p className="text-sm text-muted-foreground">
              {product.brand || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Barcode</p>
            <p className="text-sm text-muted-foreground">
              {product.barcode || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Quantity in Stock</p>
            <p className="text-sm text-muted-foreground">
              {product.quantity_in_stock}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Reorder Level</p>
            <p className="text-sm text-muted-foreground">
              {product.reorder_level}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Unit Price</p>
            <p className="text-sm text-muted-foreground">
              ₱{product.unit_price}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Cost Price</p>
            <p className="text-sm text-muted-foreground">
              ₱{product.cost_price}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Supplier</p>
            <p className="text-sm text-muted-foreground">
              {product.supplier?.name || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Date of Entry</p>
            <p className="text-sm text-muted-foreground">
              {format(product.date_of_entry, "PPP")}
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
              {product.style_design || "N/A"}
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
            <p className="text-sm text-muted-foreground">
              {product.location || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Discount</p>
            <p className="text-sm text-muted-foreground">
              {product.discount
                ? `₱${product.discount.toLocaleString()}%`
                : "No discount"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
