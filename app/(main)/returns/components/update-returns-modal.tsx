"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useLayout } from "@/components/context/LayoutProvider";

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
import { Returns } from "@/prisma/type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ThreeDots } from "react-loader-spinner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProductSearch from "./product-search";
import SalesOrderSearch from "./order-search";

import { ProductReturnCustom } from "./options";

interface UpdateProductReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  returns: ProductReturnCustom;
  onUpdate: (returns: Omit<Returns, "productReturns">) => void;
  loadingUpdateProductReturn: boolean;
}

// Define validation schema using Zod
enum FormType {
  PRODUCT = "product",
  ORDER = "order",
}

enum ProductReturnReason {
  LOST = "Lost",
  REFUND = "Refund",
  REPLACE = "Replace",
  OTHER = "Other",
}

const productReturnSchema = z
  .object({
    user_id: z.number(),
    id: z.number().int().positive("Product/Order ID is required."),
    type: z.enum([FormType.PRODUCT, FormType.ORDER]),
    quantity: z.number().int().min(1, "Quantity must be greater than 0."),
    reason: z.enum([
      ProductReturnReason.LOST,
      ProductReturnReason.REFUND,
      ProductReturnReason.REPLACE,
      ProductReturnReason.OTHER,
    ]),
    otherReason: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
    return_id: z.number().int().positive("Return ID is required."),
  })
  .refine(
    (data) => {
      if (data.reason === ProductReturnReason.OTHER) {
        return data.otherReason !== undefined && data.otherReason !== "";
      }
      return true;
    },
    {
      message: "Please provide a reason when selecting 'Other'",
      path: ["otherReason"],
    }
  );

type ProductReturnFormValues = z.infer<typeof productReturnSchema>;

const getFormType = (value: string): FormType => {
  if (value === FormType.PRODUCT || value === FormType.ORDER) {
    return value as FormType;
  } else {
    throw new Error(`Invalid form type: ${value}`);
  }
};

export function UpdateProductReturnModal({
  isOpen,
  onClose,
  returns,
  onUpdate,
  loadingUpdateProductReturn,
}: UpdateProductReturnModalProps) {
  const { user } = useLayout();
  const [activeTab, setActiveTab] = useState(getFormType(returns.type));

  const form = useForm<ProductReturnFormValues>({
    resolver: zodResolver(productReturnSchema),
    defaultValues: {
      id: returns.product_id ?? returns.order_id ?? 0,
      user_id: Number(user?.user.id ?? 0),
      type: activeTab,
      reason:
        returns.reason === ProductReturnReason.LOST ||
        returns.reason === ProductReturnReason.REFUND
          ? returns.reason
          : ProductReturnReason.OTHER,
      otherReason: returns.reason,
      quantity: returns.quantity,
      return_id: returns.return_id,
    },
  });

  const handleTabChange = (value: string) => {
    form.reset();
    form.setValue("type", value as FormType);
    setActiveTab(value as FormType);
  };

  const onSubmit = (data: ProductReturnFormValues) => {
    const updatedProductReturn: Omit<Returns, "productReturns"> = {
      ...returns, // spread the returns object to include productReturn_id and products
      ...data, // spread the updated data
    };
    // onUpdate(updatedProductReturn);
  };

  useEffect(() => {
    if (!loadingUpdateProductReturn) {
      form.reset();
      onClose();
    }
  }, [loadingUpdateProductReturn]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Returns</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="order">Order</TabsTrigger>
          </TabsList>
          <TabsContent value="product">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4 grid-cols-1">
                  {/* Product */}
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          {/* <Input type="number" {...field} /> */}
                          <ProductSearch
                            value={field.value}
                            onChange={(productId) => field.onChange(productId)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Quantity */}
                  <FormField
                    control={form.control}
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
                  {/* Reason */}
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ProductReturnReason.LOST}>
                              {ProductReturnReason.LOST}
                            </SelectItem>
                            <SelectItem value={ProductReturnReason.REFUND}>
                              {ProductReturnReason.REFUND}
                            </SelectItem>
                            <SelectItem value={ProductReturnReason.REPLACE}>
                              {ProductReturnReason.REPLACE}
                            </SelectItem>
                            <SelectItem value={ProductReturnReason.OTHER}>
                              {ProductReturnReason.OTHER}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {form.getValues("reason") === ProductReturnReason.OTHER && (
                    <FormField
                      control={form.control}
                      name="otherReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter other reason for product return"
                              {...field}
                              className="h-[200px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={loadingUpdateProductReturn}
                    className="min-w-full"
                  >
                    <span
                      className={`${loadingUpdateProductReturn ? "hidden" : "block"}`}
                    >
                      Update Product Return
                    </span>
                    <ThreeDots
                      visible={true}
                      height="50"
                      width="50"
                      color="#fff"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass={`${loadingUpdateProductReturn ? "block" : "!hidden"}`}
                    />
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="order">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4 grid-cols-1">
                  {/* Order */}
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order</FormLabel>
                        <FormControl>
                          {/* <Input type="number" {...field} /> */}
                          <SalesOrderSearch
                            value={field.value}
                            onChange={(salesOrderId) =>
                              field.onChange(salesOrderId)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Quantity */}
                  <FormField
                    control={form.control}
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
                  {/* Reason */}
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ProductReturnReason.LOST}>
                              {ProductReturnReason.LOST}
                            </SelectItem>
                            <SelectItem value={ProductReturnReason.REFUND}>
                              {ProductReturnReason.REFUND}
                            </SelectItem>
                            <SelectItem value={ProductReturnReason.OTHER}>
                              {ProductReturnReason.OTHER}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {form.getValues("reason") === ProductReturnReason.OTHER && (
                    <FormField
                      control={form.control}
                      name="otherReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter other reason for order return"
                              {...field}
                              className="h-[200px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={loadingUpdateProductReturn}
                    className="min-w-full"
                  >
                    <span
                      className={`${loadingUpdateProductReturn ? "hidden" : "block"}`}
                    >
                      Update Product Return
                    </span>
                    <ThreeDots
                      visible={true}
                      height="50"
                      width="50"
                      color="#fff"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass={`${loadingUpdateProductReturn ? "block" : "!hidden"}`}
                    />
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
