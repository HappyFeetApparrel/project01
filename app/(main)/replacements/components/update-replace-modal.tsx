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
import { Replace } from "@/prisma/type";

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

import { ReplaceCustom } from "./options";

interface UpdateReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  replace: ReplaceCustom;
  onUpdate: (replace: Omit<Replace, "replaces">) => void;
  loadingUpdateReplace: boolean;
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
    return_id: z.number().int().positive("Return ID is required."),
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

const getFormType = (value: string): FormType => {
  if (value === FormType.PRODUCT || value === FormType.ORDER) {
    return value as FormType;
  } else {
    throw new Error(`Invalid form type: ${value}`);
  }
};

export function UpdateReplaceModal({
  isOpen,
  onClose,
  replace,
  onUpdate,
  loadingUpdateReplace,
}: UpdateReplaceModalProps) {
  const { user } = useLayout();
  const [activeTab, setActiveTab] = useState(getFormType(replace.type));

  const form = useForm<ReplaceFormValues>({
    resolver: zodResolver(replaceSchema),
    defaultValues: {
      id: replace.replacement_product_id ?? replace.replacement_order_id ?? 0,
      user_id: Number(user?.user.id ?? 0),
      type: activeTab,
      reason:
        replace.reason === ReplaceReason.LOST ||
        replace.reason === ReplaceReason.RETURN ||
        replace.reason === ReplaceReason.REFUND
          ? replace.reason
          : ReplaceReason.OTHER,
      otherReason: replace.reason,
      quantity: replace.quantity,
      return_id: replace.return_id,
    },
  });

  const handleTabChange = (value: string) => {
    form.reset();
    form.setValue("type", value as FormType);
    setActiveTab(value as FormType);
  };

  const onSubmit = (data: ReplaceFormValues) => {
    const updatedReplace: Omit<Replace, "replaces"> = {
      ...replace, // spread the replace object to include replace_id and products
      ...data, // spread the updated data
    };
    // onUpdate(updatedReplace);
  };

  useEffect(() => {
    if (!loadingUpdateReplace) {
      form.reset();
      onClose();
    }
  }, [loadingUpdateReplace]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Replace</DialogTitle>
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
                    disabled={loadingUpdateReplace}
                    className="min-w-full"
                  >
                    <span
                      className={`${loadingUpdateReplace ? "hidden" : "block"}`}
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
                      wrapperClass={`${loadingUpdateReplace ? "block" : "!hidden"}`}
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
                    disabled={loadingUpdateReplace}
                    className="min-w-full"
                  >
                    <span
                      className={`${loadingUpdateReplace ? "hidden" : "block"}`}
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
                      wrapperClass={`${loadingUpdateReplace ? "block" : "!hidden"}`}
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
