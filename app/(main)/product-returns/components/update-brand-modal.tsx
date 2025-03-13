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
import { Brand } from "@/prisma/type";

import { ThreeDots } from "react-loader-spinner";

interface UpdateBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand;
  onUpdate: (brand: Omit<Brand, "brands">) => void;
  loadingUpdateBrand: boolean;
}

// Validation schema using Zod
const brandSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export function UpdateBrandModal({
  isOpen,
  onClose,
  brand,
  onUpdate,
  loadingUpdateBrand,
}: UpdateBrandModalProps) {
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand.name ?? "",
      description: brand.description ?? "",
    },
  });

  const onSubmit = (data: BrandFormValues) => {
    const updatedBrand: Omit<Brand, "brands"> = {
      ...brand, // spread the brand object to include brand_id and products
      ...data, // spread the updated data
    };
    onUpdate(updatedBrand);
  };

  useEffect(() => {
    if (!loadingUpdateBrand) {
      form.reset();
      onClose();
    }
  }, [loadingUpdateBrand]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Brand</DialogTitle>
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
                      <Input placeholder="Brand Name" {...field} />
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
                        placeholder="Brand Description"
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
                disabled={loadingUpdateBrand}
                className="min-w-[50%]"
              >
                <span className={`${loadingUpdateBrand ? "hidden" : "block"}`}>
                  Update Brand
                </span>
                <ThreeDots
                  visible={true}
                  height="50"
                  width="50"
                  color="#fff"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass={`${loadingUpdateBrand ? "block" : "!hidden"}`}
                />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
