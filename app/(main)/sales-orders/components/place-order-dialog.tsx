"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, X } from "lucide-react";

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

interface OrderItem {
  product: Product;
  quantity_in_stock: number;
}

import ProductSearch from "./product-search";

export function PlaceOrderDialog({ open, setOpen }: PlaceOrderDialogProps) {
  // const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  // const [showFailPopup, setShowFailPopup] = useState(false);
  // const [showPrintInvoice, setShowPrintInvoice] = useState(false);
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

  const addToOrder = (product: Product) => {
    const existingItem = orderItems.find(
      (item) => item.product.product_id === product.product_id
    );
    if (existingItem) {
      if (existingItem.quantity_in_stock < product.quantity_in_stock) {
        setOrderItems(
          orderItems.map((item) =>
            item.product.product_id === product.product_id
              ? { ...item, quantity_in_stock: item.quantity_in_stock + 1 }
              : item
          )
        );
      }
    } else {
      setOrderItems([...orderItems, { product, quantity_in_stock: 1 }]);
    }
  };

  const removeFromOrder = (product_id: number) => {
    setOrderItems(
      orderItems.filter((item) => item.product.product_id !== product_id)
    );
  };

  const updateQuantity = (product_id: number, newQuantity: number) => {
    const product = products.find((p) => p.product_id === product_id);
    if (!product) return;

    if (newQuantity < 1) {
      removeFromOrder(product_id);
    } else if (newQuantity <= product.quantity_in_stock) {
      setOrderItems(
        orderItems.map((item) =>
          item.product.product_id === product_id
            ? { ...item, quantity_in_stock: newQuantity }
            : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const priceAfterDiscount =
        item.product.unit_price * (1 - (item.product.discount ?? 0) / 100);
      return total + priceAfterDiscount * item.quantity_in_stock;
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
    //       product_id: item.product.product_id,
    //       quantity_in_stock: item.quantity_in_stock,
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
            <ProductSearch
              addToOrder={addToOrder}
              products={products}
              setProducts={setProducts}
              loading={loading}
              setLoading={setLoading}
              error={error}
              setError={setError}
            />

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
                        key={item.product.product_id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(
                                item.product.product_id,
                                item.quantity_in_stock - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span>{item.quantity_in_stock}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(
                                item.product.product_id,
                                item.quantity_in_stock + 1
                              )
                            }
                            disabled={
                              item.quantity_in_stock >=
                              item.product.quantity_in_stock
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="flex-1 mx-2">{item.product.name}</span>
                        <span>
                          $
                          {(
                            item.product.unit_price * item.quantity_in_stock
                          ).toFixed(2)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() =>
                            removeFromOrder(item.product.product_id)
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
