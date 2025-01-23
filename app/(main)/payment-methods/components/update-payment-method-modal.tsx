"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

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

interface UpdatePaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: PaymentMethod;
  onUpdate: (paymentMethod: Omit<PaymentMethod, "paymentMethods">) => void;
  loadingUpdatePaymentMethod: boolean;
}

// Validation schema using Zod
const paymentMethodSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export function UpdatePaymentMethodModal({
  isOpen,
  onClose,
  paymentMethod,
  onUpdate,
  loadingUpdatePaymentMethod,
}: UpdatePaymentMethodModalProps) {
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: paymentMethod.name ?? "",
      description: paymentMethod.description ?? "",
    },
  });

  const onSubmit = (data: PaymentMethodFormValues) => {
    const updatedPaymentMethod: Omit<PaymentMethod, "paymentMethods"> = {
      ...paymentMethod, // spread the paymentMethod object to include paymentMethod_id and products
      ...data, // spread the updated data
    };
    onUpdate(updatedPaymentMethod);
  };

  useEffect(() => {
    if (!loadingUpdatePaymentMethod) {
      form.reset();
      onClose();
    }
  }, [loadingUpdatePaymentMethod]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update PaymentMethod</DialogTitle>
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
                      <Input placeholder="PaymentMethod Name" {...field} />
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
                        placeholder="PaymentMethod Description"
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
                disabled={loadingUpdatePaymentMethod}
                className="min-w-[50%]"
              >
                <span
                  className={`${
                    loadingUpdatePaymentMethod ? "hidden" : "block"
                  }`}
                >
                  Update PaymentMethod
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
                    loadingUpdatePaymentMethod ? "block" : "!hidden"
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
