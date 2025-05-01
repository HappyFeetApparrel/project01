"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { Replace } from "@/prisma/type";
import { useLayout } from "@/components/context/LayoutProvider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ThreeDots } from "react-loader-spinner";
import { useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (replace: Pick<Replace, "reason">) => void;
  loadingAddReplace: boolean;
}

// Define validation schema using Zod
enum FormType {
  PRODUCT = "product",
  ORDER = "order",
}

enum ReplaceReason {
  LOST = "Lost",
  RETURN = "Return",
  REFUND = "Refund",
  REPLACE = "Replace",
  OTHER = "Other",
}

const replaceSchema = z
  .object({
    user_id: z.number(),
    id: z.number().int().positive("Product/Order ID is required."),
    type: z.enum([FormType.PRODUCT, FormType.ORDER]),
    quantity: z.number().int().min(1, "Quantity must be greater than 0."),
    reason: z.enum([
      ReplaceReason.LOST,
      ReplaceReason.RETURN,
      ReplaceReason.REFUND,
      ReplaceReason.REPLACE,
      ReplaceReason.OTHER,
    ]),
    otherReason: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.reason === ReplaceReason.OTHER) {
        return data.otherReason !== undefined && data.otherReason !== "";
      }
      return true;
    },
    {
      message: "Please provide a reason when selecting 'Other'",
      path: ["otherReason"],
    }
  );

type ReplaceFormValues = z.infer<typeof replaceSchema>;

import ProductSearch from "./product-search";
import SalesOrderSearch from "./order-search";

export function AddReplaceModal({
  isOpen,
  onClose,
  onAdd,
  loadingAddReplace,
}: AddReplaceModalProps) {
  const { user } = useLayout();
  const [activeTab, setActiveTab] = useState(FormType.PRODUCT);
  const form = useForm<ReplaceFormValues>({
    resolver: zodResolver(replaceSchema),
    defaultValues: {
      user_id: Number(user?.user.id ?? 0),
      type: activeTab,
      reason: ReplaceReason.OTHER,
      otherReason: "",
    },
  });

  const handleTabChange = (value: string) => {
    form.reset();
    form.setValue("type", value as FormType);
    setActiveTab(value as FormType);
  };

  const onSubmit = (data: ReplaceFormValues) => {
    if (onAdd) {
      data.user_id = Number(user?.user.id ?? 0);
      const replaceData: Pick<Replace, "reason"> = {
        ...data,
      };
      onAdd(replaceData);
    }
  };

  useEffect(() => {
    if (!loadingAddReplace) {
      form.reset();
      onClose();
    }
  }, [loadingAddReplace]);

  // useEffect(() => {
  // }, [form.watch()]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Product Return</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="product"
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
                            <SelectItem value={ReplaceReason.LOST}>
                              {ReplaceReason.LOST}
                            </SelectItem>
                            <SelectItem value={ReplaceReason.RETURN}>
                              {ReplaceReason.RETURN}
                            </SelectItem>
                            <SelectItem value={ReplaceReason.REFUND}>
                              {ReplaceReason.REFUND}
                            </SelectItem>
                            <SelectItem value={ReplaceReason.OTHER}>
                              {ReplaceReason.OTHER}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {form.getValues("reason") === ReplaceReason.OTHER && (
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
                    disabled={loadingAddReplace}
                    className="min-w-full"
                  >
                    <span
                      className={`${loadingAddReplace ? "hidden" : "block"}`}
                    >
                      Add Product Return
                    </span>
                    <ThreeDots
                      visible={true}
                      height="50"
                      width="50"
                      color="#fff"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass={`${loadingAddReplace ? "block" : "!hidden"}`}
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
                            <SelectItem value={ReplaceReason.LOST}>
                              {ReplaceReason.LOST}
                            </SelectItem>
                            <SelectItem value={ReplaceReason.RETURN}>
                              {ReplaceReason.RETURN}
                            </SelectItem>
                            <SelectItem value={ReplaceReason.REFUND}>
                              {ReplaceReason.REFUND}
                            </SelectItem>
                            <SelectItem value={ReplaceReason.REPLACE}>
                              {ReplaceReason.REPLACE}
                            </SelectItem>
                            <SelectItem value={ReplaceReason.OTHER}>
                              {ReplaceReason.OTHER}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {form.getValues("reason") === ReplaceReason.OTHER && (
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
                    disabled={loadingAddReplace}
                    className="min-w-full"
                  >
                    <span
                      className={`${loadingAddReplace ? "hidden" : "block"}`}
                    >
                      Add Product Return
                    </span>
                    <ThreeDots
                      visible={true}
                      height="50"
                      width="50"
                      color="#fff"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass={`${loadingAddReplace ? "block" : "!hidden"}`}
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
