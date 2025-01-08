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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Supplier } from "@/prisma/type";

import { ThreeDots } from "react-loader-spinner";
import { useEffect } from "react";

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (supplier: Omit<Supplier, "supplier_id" | "products">) => void;
  loadingAddSupplier: boolean;
}

// Define validation schema using Zod
const supplierSchema = z.object({
  name: z.string().min(1, "Name is required."),
  contact_person: z.string().min(1, "Contact Person is required."),
  phone_number: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^\d*$/, "Phone number must be numeric."),
  address: z.string().min(1, "Address is required."),
  supplied_products: z.string().min(1, "Supplied Products are required."),
  email_address: z
    .string()
    .min(1, "Email address is required.")
    .email("Invalid email address."),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export function AddSupplierModal({
  isOpen,
  onClose,
  onAdd,
  loadingAddSupplier,
}: AddSupplierModalProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contact_person: "",
      phone_number: "",
      email_address: "",
      address: "",
      supplied_products: "",
    },
  });

  const onSubmit = (data: SupplierFormValues) => {
    if (onAdd) {
      const supplierData: Omit<Supplier, "supplier_id" | "products"> = {
        ...data,
      };
      onAdd(supplierData);
    }
  };

  useEffect(() => {
    console.log("loadingAddSupplier:", loadingAddSupplier);
    if (loadingAddSupplier) {
      form.reset();
      onClose();
    }
  }, [loadingAddSupplier]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4 grid-cols-2">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Supplier Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Contact Person */}
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact Person Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email Address */}
              <FormField
                control={form.control}
                name="email_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@domain.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Supplier Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Supplied Products */}
              <FormField
                control={form.control}
                name="supplied_products"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Supplied Products</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter products separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Example: Electronics, Furniture, Clothing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loadingAddSupplier}>
                <span className={`${loadingAddSupplier ? "hidden" : "block"}`}>
                  Add Supplier
                </span>
                <ThreeDots
                  visible={true}
                  height="50"
                  width="50"
                  color="#fff"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass={`${loadingAddSupplier ? "block" : "!hidden"}`}
                />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
