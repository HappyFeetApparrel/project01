"use client";
import { api } from "@/lib/axios";
import PaymentMethodSearch from "../../sales-orders/components/payment-method-search";
import { X, Search, Minus, Plus } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

import { Product } from "@/prisma/type";
import { SalesOrder } from "@/prisma/type";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProductReplacement,
  createOrderReplacement,
} from "@/lib/actions/replacement-actions";
import { useToast } from "@/hooks/use-toast";
import { XIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  productReplacementSchema,
  orderReplacementSchema,
} from "@/lib/schemas/replacement-schemas";
import type { z } from "zod";
import { useLayout } from "@/components/context/LayoutProvider";
import ProductSearch from "./product-search";
import SalesOrderSearch from "./order-search";
import { useReplaceContext } from "../provider/replace-provider";

interface AddReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  addNewProduct: boolean;
  setAddNewProduct: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddReplaceModal({
  isOpen,
  onClose,
  addNewProduct,
  setAddNewProduct,
}: AddReplaceModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("product");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useLayout();
  const { saveActivity, product, setCreateProduct } = useLayout();
  const { replaces, loading, error, fetchReplaces } = useReplaceContext();
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder>();
  const [productPrice, setProductPrice] = useState(0);
  const [change, setChange] = useState(0);
  const VAT_RATE = 0.12;

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  // Product replacement form
  const productForm = useForm<z.infer<typeof productReplacementSchema>>({
    resolver: zodResolver(productReplacementSchema),
    defaultValues: {
      originalOrderId: undefined,
      replacementProductId: undefined,
      quantity: 0,
      reason: "",
      otherReason: "",
    },
  });

  // Order replacement form
  const orderForm = useForm<z.infer<typeof orderReplacementSchema>>({
    resolver: zodResolver(orderReplacementSchema),
    defaultValues: {
      originalOrderId: undefined,
      replacementProductId: undefined,
      paymentMethodId: undefined,
      reason: "",
      otherReason: "",
    },
  });

  useEffect(() => {
    const { totalWithVAT } = calculateTotal();
    const amountGiven = orderForm.getValues("amountGiven");
    const change = amountGiven - totalWithVAT;
    if (change >= 0) {
      setChange(amountGiven - totalWithVAT);
    } else {
      setChange(0);
    }
  }, [orderForm.watch("amountGiven"), selectedProduct]);

  const handleSubmitProductReplacement = async (
    values: z.infer<typeof productReplacementSchema>
  ) => {
    setIsSubmitting(true);

    try {
      // Prepare the data for submission
      const formData = {
        original_order_id: values.originalOrderId,
        replacement_product_id: values.replacementProductId,
        quantity: values.quantity,
        reason: values.reason === "Other" ? values.otherReason! : values.reason,
        processed_by_id: Number(user?.user.id ?? 0),
      };

      const result = await createProductReplacement(formData);
      await fetchReplaces();

      if (result.success) {
        saveActivity(
          "Add Product Replacement",
          "Product Replacement added successfully"
        );
        showStatusPopup("Product Replacement added successfully", "success");
      } else {
        showStatusPopup("Unexpected response while adding product", "error");
      }

      router.refresh();
      onClose();

      // // If payment is required, redirect to the replacement details page
      // if (result.payment_required || result.refund_required) {
      //   router.push(`/replacements/${result.replace_id}`);
      // }
    } catch (error) {
      console.error("Error creating product replacement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrderReplacement = async (
    values: z.infer<typeof orderReplacementSchema>
  ) => {
    setIsSubmitting(true);
    const orderItems = [
      {
        product: selectedProduct,
        quantity_in_stock: productForm.getValues("quantity"),
      },
    ];

    try {
      // Prepare the data for submission
      const formData = {
        processed_by_id: Number(user?.user.id ?? 0),
        items: orderItems,
        totalAmount: totalWithVAT,
        change: values.amountGiven - totalWithVAT,
        original_order_id: values.originalOrderId,
        replacement_product_id: values.replacementProductId,
        quantity: values.quantity,
        reason: values.reason === "Other" ? values.otherReason! : values.reason,
        paymentMethodId: values.paymentMethodId,
        amountGiven: values.amountGiven,
      };

      const result = await createOrderReplacement(formData);
      await fetchReplaces();

      if (result.success) {
        saveActivity(
          "Add Order Replacement",
          "Order Replacement added successfully"
        );
        showStatusPopup("Order Replacement added successfully", "success");
      } else {
        showStatusPopup("Unexpected response while adding Order", "error");
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error creating order replacement:", error);
      toast({
        title: "Error",
        description: "Failed to create order replacement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const decreaseQuantity = () => {
    if (orderForm.getValues("quantity") > 1)
      orderForm.setValue("quantity", orderForm.getValues("quantity") - 1); // setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    orderForm.setValue("quantity", orderForm.getValues("quantity") + 1);
  };

  useEffect(() => {
    // @ts-ignore
    orderForm.setValue("quantity", selectedOrder?.quantity ?? 0); // setQuantity(selectedOrder?.quantity ?? 0);
    // @ts-ignore
    orderForm.setValue("amountGiven", selectedOrder?.totalPrice ?? 0);
  }, [selectedOrder]);

  const calculateTotal = () => {
    if (!selectedProduct) {
      return { subtotal: 0, vatAmount: 0, totalWithVAT: 0 };
    }

    const subtotal =
      selectedProduct.unit_price * orderForm.getValues("quantity");

    const vatAmount = subtotal * VAT_RATE;
    const totalWithVAT = subtotal + vatAmount;

    return { subtotal, vatAmount, totalWithVAT };
  };

  const { subtotal, vatAmount, totalWithVAT } = calculateTotal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]  max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Replacement</DialogTitle>
            {/* <Button variant="ghost" size="icon" onClick={onClose}>
              <XIcon className="h-4 w-4" />
            </Button> */}
          </div>
          <DialogDescription>
            Create a new replacement for a returned product or order
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="product"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="order">Order</TabsTrigger>
          </TabsList>

          <TabsContent value="product">
            <Form {...productForm}>
              <form
                onSubmit={productForm.handleSubmit(
                  handleSubmitProductReplacement
                )}
                className="space-y-4 pt-4"
              >
                <FormField
                  control={productForm.control}
                  name="originalOrderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Order</FormLabel>
                      <FormControl>
                        <SalesOrderSearch
                          value={field.value}
                          onChange={(productId) => field.onChange(productId)}
                          placeholder="Select original order..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={productForm.control}
                  name="replacementProductId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        Replacement Product
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="airplane-mode"
                            checked={addNewProduct}
                            onCheckedChange={() => {
                              setAddNewProduct(true);
                              onClose();
                            }}
                          />
                          <p>Add new product?</p>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <ProductSearch
                          value={field.value}
                          onChange={(productId) => field.onChange(productId)}
                          placeholder="Select replacement product..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity */}
                <FormField
                  control={productForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={productForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Defective">Defective</SelectItem>
                          <SelectItem value="Wrong Item">Wrong Item</SelectItem>
                          <SelectItem value="Damaged">Damaged</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {productForm.watch("reason") === "Other" && (
                  <FormField
                    control={productForm.control}
                    name="otherReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter other reason for product replacement"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Add Product Replacement"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="order">
            <Form {...orderForm}>
              <form
                onSubmit={orderForm.handleSubmit(handleSubmitOrderReplacement)}
                className="space-y-4 pt-4"
              >
                <FormField
                  control={orderForm.control}
                  name="originalOrderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Order</FormLabel>
                      <FormControl>
                        <SalesOrderSearch
                          value={field.value}
                          onChange={(productId) => field.onChange(productId)}
                          placeholder="Select original order..."
                          setSelectedOrder={setSelectedOrder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={orderForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Defective">Defective</SelectItem>
                          <SelectItem value="Wrong Item">Wrong Item</SelectItem>
                          <SelectItem value="Damaged">Damaged</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {orderForm.watch("reason") === "Other" && (
                  <FormField
                    control={orderForm.control}
                    name="otherReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter other reason for order replacement"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={orderForm.control}
                  name="replacementProductId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        Replacement Product
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="airplane-mode"
                            checked={addNewProduct}
                            onCheckedChange={() => {
                              setAddNewProduct(true);
                              onClose();
                            }}
                          />
                          <p>Add new product?</p>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <ProductSearch
                          value={field.value}
                          onChange={(productId) => field.onChange(productId)}
                          placeholder="Select replacement product..."
                          setSelectedProduct={setSelectedProduct}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Order Summary</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-md"
                        onClick={decreaseQuantity}
                        type="button"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span>{orderForm.getValues("quantity")}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-md"
                        onClick={increaseQuantity}
                        type="button"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    {selectedProduct && (
                      <div className="flex items-center gap-2">
                        <span>{selectedProduct.name}</span>
                        <span>₱{selectedProduct.unit_price.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (12%):</span>
                      <span>₱{vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>₱{totalWithVAT.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-4">
                    <FormField
                      control={orderForm.control}
                      name="paymentMethodId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <PaymentMethodSearch
                              value={field.value}
                              onChange={(brandId) => field.onChange(brandId)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={orderForm.control}
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

                    <div className="flex justify-between">
                      <span>Change:</span>
                      <span>₱{change.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || change <= 0}
                >
                  {isSubmitting ? "Processing..." : "Add Order Replacement"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
