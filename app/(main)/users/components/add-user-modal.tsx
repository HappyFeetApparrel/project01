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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/prisma/type";
import { ThreeDots } from "react-loader-spinner";
import { useEffect } from "react";

// 🛠️ Updated Props Interface
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (
    user: Omit<
      User,
      | "user_id"
      | "orders"
      | "adjustments"
      | "logs"
      | "created_at"
      | "updated_at"
    >
  ) => void;
  loadingAddUser: boolean;
}

// 🔎 Validation Schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["Admin", "Manager", "Staff"], {
    required_error: "Role is required.",
  }),
});

type UserFormValues = z.infer<typeof userSchema>;

export function AddUserModal({
  isOpen,
  onClose,
  onAdd,
  loadingAddUser,
}: AddUserModalProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Staff",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    if (onAdd) {
        // @ts-expect-error this will cause error
      const userData: Omit<
        User,
        | "user_id"
        | "orders"
        | "adjustments"
        | "logs"
        | "created_at"
        | "updated_at"
      > = {
        ...data,
      };
      onAdd(userData);
    }
  };

  useEffect(() => {
    if (!loadingAddUser) {
      form.reset();
      onClose();
    }
  }, [loadingAddUser]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@domain.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full border rounded-md p-2">
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <DialogFooter>
              <Button
                type="submit"
                disabled={loadingAddUser}
                className="w-full"
              >
                {loadingAddUser ? (
                  <ThreeDots
                    visible={true}
                    height="30"
                    width="30"
                    color="#fff"
                    radius="9"
                    ariaLabel="loading"
                  />
                ) : (
                  "Add User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
