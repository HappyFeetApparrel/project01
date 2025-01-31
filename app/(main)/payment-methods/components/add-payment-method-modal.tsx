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
import { PaymentMethod } from "@/prisma/type";

import { ThreeDots } from "react-loader-spinner";
import { useEffect } from "react";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (paymentMethod: Pick<PaymentMethod, "name" | "description">) => void;
  loadingAddPaymentMethod: boolean;
}

// Define validation schema using Zod
const paymentMethodSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export function AddPaymentMethodModal({
  isOpen,
  onClose,
  onAdd,
  loadingAddPaymentMethod,
}: AddPaymentMethodModalProps) {
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: PaymentMethodFormValues) => {
    if (onAdd) {
      const paymentMethodData: Pick<PaymentMethod, "name" | "description"> = {
        ...data,
      };
      onAdd(paymentMethodData);
    }
  };

  useEffect(() => {
    if (!loadingAddPaymentMethod) {
      form.reset();
      onClose();
    }
  }, [loadingAddPaymentMethod]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Payment Method</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4 grid-cols-1">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Payment Method Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Payment Method Description"
                        {...field}
                        className="h-[200px]"
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
                disabled={loadingAddPaymentMethod}
                className="min-w-full"
              >
                <span
                  className={`${loadingAddPaymentMethod ? "hidden" : "block"}`}
                >
                  Add PaymentMethod
                </span>
                <ThreeDots
                  visible={true}
                  height="50"
                  width="50"
                  color="#fff"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass={`${
                    loadingAddPaymentMethod ? "block" : "!hidden"
                  }`}
                />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
