"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Product } from "@/prisma/type";

import { ThreeDots } from "react-loader-spinner";
import { useEffect } from "react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (
    product: Omit<Product, "product_id" | "order_items" | "adjustments">
  ) => void;
  loadingAddProduct: boolean;
}

const productSchema = z.object({
  product_id: z.number().min(1, "Product ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category_id: z.number().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  quantity_in_stock: z.number().min(0, "Quantity must be 0 or greater"),
  reorder_level: z.number().min(0, "Reorder level must be 0 or greater"),
  unit_price: z.number().min(0, "Unit price must be 0 or greater"),
  cost_price: z.number().min(0, "Cost price must be 0 or greater"),
  supplier_id: z.number().optional(),
  date_of_entry: z.date(),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  style_design: z.string().optional(),
  product_image: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.number().optional(),
  brand: z.string().optional(),
  season: z.string().optional(),
  expiration_date: z.date().optional(),
  status: z.string().min(1, "Status is required"),
  location: z.string().optional(),
  discount: z.number().min(0, "Discount must be 0 or greater").optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductModal({
  isOpen,
  onClose,
  onAdd,
  loadingAddProduct,
}: AddProductModalProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_id: 0,
      name: "",
      description: "",
      category_id: undefined,
      sku: "",
      barcode: "",
      quantity_in_stock: 0,
      reorder_level: 0,
      unit_price: 0,
      cost_price: 0,
      supplier_id: undefined,
      date_of_entry: new Date(),
      size: "",
      color: "",
      material: "",
      style_design: "",
      product_image: "",
      dimensions: "",
      weight: undefined,
      brand: "",
      season: "",
      expiration_date: undefined,
      status: "Active",
      location: "",
      discount: 0,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (onAdd) {
      const productData: Omit<
        Product,
        "product_id" | "order_items" | "adjustments"
      > = {
        ...data,
        date_of_entry: new Date(),
      };
      onAdd(productData);
    }
  };

  useEffect(() => {
    if (!loadingAddProduct) {
      form.reset();
      onClose();
    }
  }, [loadingAddProduct]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4 grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Product Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity_in_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity In Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input placeholder="Active/Discontinued" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category ID</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Barcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input placeholder="Material" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="style_design"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style Design</FormLabel>
                    <FormControl>
                      <Input placeholder="Style Design" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input placeholder="Dimensions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Brand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season</FormLabel>
                    <FormControl>
                      <Input placeholder="Season" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={loadingAddProduct}
                className="w-full"
              >
                {loadingAddProduct ? (
                  <ThreeDots width="30" color="#fff" />
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
