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
import { ProductReturn } from "@/prisma/type";

import { ThreeDots } from "react-loader-spinner";

interface UpdateProductReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  productReturn: ProductReturn;
  onUpdate: (productReturn: Omit<ProductReturn, "productReturns">) => void;
  loadingUpdateProductReturn: boolean;
}

// Validation schema using Zod
const productReturnSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

type ProductReturnFormValues = z.infer<typeof productReturnSchema>;

export function UpdateProductReturnModal({
  isOpen,
  onClose,
  productReturn,
  onUpdate,
  loadingUpdateProductReturn,
}: UpdateProductReturnModalProps) {
  const form = useForm<ProductReturnFormValues>({
    resolver: zodResolver(productReturnSchema),
    defaultValues: {
      name: productReturn.name ?? "",
      description: productReturn.description ?? "",
    },
  });

  const onSubmit = (data: ProductReturnFormValues) => {
    const updatedProductReturn: Omit<ProductReturn, "productReturns"> = {
      ...productReturn, // spread the productReturn object to include productReturn_id and products
      ...data, // spread the updated data
    };
    onUpdate(updatedProductReturn);
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
          <DialogTitle>Update ProductReturn</DialogTitle>
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
                      <Input placeholder="ProductReturn Name" {...field} />
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
                        placeholder="ProductReturn Description"
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
                disabled={loadingUpdateProductReturn}
                className="min-w-[50%]"
              >
                <span className={`${loadingUpdateProductReturn ? "hidden" : "block"}`}>
                  Update ProductReturn
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
      </DialogContent>
    </Dialog>
  );
}
