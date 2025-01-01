"use client";

import { useState } from "react";
import { Plus, Minus, X, Search } from "lucide-react";
import Image from "next/image";
import { products } from "@/data/product";

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
import { SuccessPopup } from "./success-popup";
import { FailPopup } from "./fail-popup";

interface Product {
  productId: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  barcode: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  dateOfEntry: Date;
  size: string;
  color: string;
  material: string;
  style: string;
  brand: string;
  season: string;
  status: string;
  location: string;
  discount: number;
  image: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "cash"], {
    required_error: "Payment method is required",
  }),
});

interface PlaceOrderDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function PlaceOrderDialog({ open, setOpen }: PlaceOrderDialogProps) {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailPopup, setShowFailPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      paymentMethod: undefined,
    },
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (product: Product) => {
    const existingItem = orderItems.find(
      (item) => item.product.productId === product.productId
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([...orderItems, { product, quantity: 1 }]);
    }
  };

  const removeFromOrder = (productId: string) => {
    setOrderItems(
      orderItems.filter((item) => item.product.productId !== productId)
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromOrder(productId);
    } else {
      setOrderItems(
        orderItems.map((item) =>
          item.product.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const priceAfterDiscount =
        item.product.unitPrice * (1 - item.product.discount / 100);
      return total + priceAfterDiscount * item.quantity;
    }, 0);
  };

  async function onSubmit(values: z.infer<typeof orderSchema>) {
    try {
      if (orderItems.length === 0) {
        throw new Error("No products in order");
      }

      const orderData = {
        ...values,
        items: orderItems,
        totalAmount: calculateTotal(),
        orderDate: new Date(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(orderData);
      setOpen(false);
      setShowSuccessPopup(true);
      setOrderItems([]); // Clear the order after successful submission
    } catch (error) {
      console.error(error);
      setShowFailPopup(true);
    }
  }

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {filteredProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b last:border-b-0"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${product.unitPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.quantity}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => addToOrder(product)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
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
                            onClick={() =>
                              updateQuantity(
                                item.product.productId,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(
                                item.product.productId,
                                item.quantity + 1
                              )
                            }
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
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={orderItems.length === 0}>
                      Place Order
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
      )}
    </>
  );
}
