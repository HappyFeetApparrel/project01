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
import { Category } from "@/prisma/type";

import { ThreeDots } from "react-loader-spinner";

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onUpdate: (category: Omit<Category, "categories">) => void;
  loadingUpdateCategory: boolean;
}

// Validation schema using Zod
const categorySchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function UpdateCategoryModal({
  isOpen,
  onClose,
  category,
  onUpdate,
  loadingUpdateCategory,
}: UpdateCategoryModalProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name ?? "",
      description: category.description ?? "",
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    const updatedCategory: Omit<Category, "categories"> = {
      ...category, // spread the category object to include category_id and products
      ...data, // spread the updated data
    };
    onUpdate(updatedCategory);
  };

  useEffect(() => {
    if (!loadingUpdateCategory) {
      form.reset();
      onClose();
    }
  }, [loadingUpdateCategory]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
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
                      <Input placeholder="Category Name" {...field} />
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
                        placeholder="Category Description"
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
                disabled={loadingUpdateCategory}
                className="min-w-[50%]"
              >
                <span
                  className={`${loadingUpdateCategory ? "hidden" : "block"}`}
                >
                  Update Category
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
                    loadingUpdateCategory ? "block" : "!hidden"
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
