"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, X, Search } from "lucide-react";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import { SuccessPopup } from "./success-popup";
// import { FailPopup } from "./fail-popup";
// import { PrintInvoiceDialog } from "./print-invoice-dialog";
// import { getInventory, updateInventory } from "../utils/inventory";

// import types
// import { Product } from "@/data/product";
import OrderItem from "../types/order-item";
// import OrderData from "../types/order-data";

const orderSchema = z.object({
  paymentMethod: z.enum(["credit_card", "bank_transfer", "cash"], {
    required_error: "Payment method is required",
  }),
  amountGiven: z.number().min(0, "Amount must be 0 or greater"),
});

interface PlaceOrderDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

import { Product } from "@/prisma/type";

export function PlaceOrderDialog({ open, setOpen }: PlaceOrderDialogProps) {
  // const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  // const [showFailPopup, setShowFailPopup] = useState(false);
  // const [showPrintInvoice, setShowPrintInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [change, setChange] = useState(0);
  // const [isProcessing, setIsProcessing] = useState(false);
  // const [currentOrderData, setCurrentOrderData] = useState<OrderData | null>(
  //   null
  // );

  // const [inventory, setInventory] = useState<Product[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      paymentMethod: undefined,
      amountGiven: 0,
    },
  });

  // useEffect(() => {
  //   setInventory(getInventory());
  // }, []);

  // const filteredProducts = inventory.filter(
  //   (product) =>
  //     product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const addToOrder = (product: Product) => {
  //   const existingItem = orderItems.find(
  //     (item) => item.product.productId === product.productId
  //   );
  //   if (existingItem) {
  //     if (existingItem.quantity < product.quantity) {
  //       setOrderItems(
  //         orderItems.map((item) =>
  //           item.product.productId === product.productId
  //             ? { ...item, quantity: item.quantity + 1 }
  //             : item
  //         )
  //       );
  //     }
  //   } else {
  //     setOrderItems([...orderItems, { product, quantity: 1 }]);
  //   }
  // };

  const removeFromOrder = (productId: string) => {
    setOrderItems(
      orderItems.filter((item) => item.product.productId !== productId)
    );
  };

  // const updateQuantity = (productId: string, newQuantity: number) => {
  //   const product = inventory.find((p) => p.productId === productId);
  //   if (!product) return;

  //   if (newQuantity < 1) {
  //     removeFromOrder(productId);
  //   } else if (newQuantity <= product.quantity) {
  //     setOrderItems(
  //       orderItems.map((item) =>
  //         item.product.productId === productId
  //           ? { ...item, quantity: newQuantity }
  //           : item
  //       )
  //     );
  //   }
  // };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const priceAfterDiscount =
        item.product.unitPrice * (1 - item.product.discount / 100);
      return total + priceAfterDiscount * item.quantity;
    }, 0);
  };

  useEffect(() => {
    const total = calculateTotal();
    const amountGiven = form.getValues("amountGiven");
    setChange(amountGiven - total);
  }, [orderItems, form.watch("amountGiven")]);

  async function onSubmit(values: z.infer<typeof orderSchema>) {
    console.log(values);
    // try {
    //   if (orderItems.length === 0) {
    //     throw new Error("No products in order");
    //   }

    //   const total = calculateTotal();
    //   if (values.amountGiven < total) {
    //     throw new Error("Insufficient payment amount");
    //   }

    //   setIsProcessing(true);

    //   const orderData: OrderData = {
    //     ...values,
    //     items: orderItems,
    //     totalAmount: total,
    //     change: values.amountGiven - total,
    //     orderDate: new Date(),
    //   };

    //   // Simulate API call
    //   await new Promise((resolve) => setTimeout(resolve, 2000));
    //   console.log(orderData);

    //   // Update inventory
    //   updateInventory(
    //     orderItems.map((item) => ({
    //       productId: item.product.productId,
    //       quantity: item.quantity,
    //     }))
    //   );
    //   setInventory(getInventory());

    //   setCurrentOrderData(orderData);
    //   setIsProcessing(false);
    //   setShowPrintInvoice(true);
    // } catch (error) {
    //   console.error(error);
    //   setIsProcessing(false);
    //   setShowFailPopup(true);
    // }
  }

  // const handlePrintInvoiceClose = () => {
  //   setShowPrintInvoice(false);
  //   setShowSuccessPopup(true);
  //   setTimeout(() => {
  //     setShowSuccessPopup(false);
  //     setOpen(false);
  //     setOrderItems([]);
  //     form.reset();
  //   }, 3000);
  // };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Place New Order</DialogTitle>
            <DialogDescription>
              Search for products and add them to the order.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Product Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, SKU, or barcode..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Product List */}
              <div className="border rounded-md max-h-[50vh] overflow-y-auto">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b last:border-b-0 animate-pulse"
                    >
                      <Skeleton className="w-12 h-12 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="w-1/2 h-4 mb-2" />
                        <Skeleton className="w-1/3 h-4" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="w-1/2 h-4 mb-2" />
                        <Skeleton className="w-1/3 h-4" />
                      </div>
                      <Button size="sm" disabled>
                        <Skeleton className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : error ? (
                  <div className="border rounded-md max-h-[50vh] overflow-y-auto">
                    <div className="flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b last:border-b-0"></div>
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : (
                  products.map((product: Product, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b last:border-b-0"
                    >
                      <Image
                        src={product.product_image ?? ""}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover w-14 h-14"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        {/* <p className="text-sm text-muted-foreground">
                        SKU: {product.sku}
                      </p> */}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${product.unit_price.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.quantity_in_stock}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        // onClick={() => addToOrder(product)}
                        disabled={product.quantity_in_stock === 0}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Order Summary */}
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Order Summary</h4>
                {orderItems.length === 0 ? (
                  <p className="text-muted-foreground">No items in order</p>
                ) : (
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div
                        key={item.product.productId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            // onClick={() =>
                            //   updateQuantity(
                            //     item.product.productId,
                            //     item.quantity - 1
                            //   )
                            // }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            // onClick={() =>
                            //   updateQuantity(
                            //     item.product.productId,
                            //     item.quantity + 1
                            //   )
                            // }
                            disabled={item.quantity >= item.product.quantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="flex-1 mx-2">{item.product.name}</span>
                        <span>
                          ${(item.product.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() =>
                            removeFromOrder(item.product.productId)
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="credit_card">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="bank_transfer">
                              Bank Transfer
                            </SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amountGiven"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount Given *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter amount given"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Change:</span>
                    <span className="text-lg font-bold">
                      ${change.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      // disabled={
                      //   orderItems.length === 0 || change < 0 || isProcessing
                      // }
                    >
                      {/* {isProcessing ? "Processing..." : "Place Order"} */}
                      Place Order
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* {showPrintInvoice && (
        <PrintInvoiceDialog
          isOpen={showPrintInvoice}
          onClose={handlePrintInvoiceClose}
          orderData={currentOrderData}
        />
      )}
      {showSuccessPopup && (
        <SuccessPopup
          message="Order placed successfully!"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      {showFailPopup && (
        <FailPopup
          message="Failed to place order. Please try again."
          onClose={() => setShowFailPopup(false)}
        />
      )} */}
    </>
  );
}
