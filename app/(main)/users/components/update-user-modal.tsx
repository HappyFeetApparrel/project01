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

// --------------------- AddUserModal ---------------------
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

const addUserSchema = z.object({
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

type AddUserFormValues = z.infer<typeof addUserSchema>;

export function AddUserModal({
  isOpen,
  onClose,
  onAdd,
  loadingAddUser,
}: AddUserModalProps) {
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Staff",
    },
  });

  const onSubmit = (data: AddUserFormValues) => {
    if (onAdd) {
      onAdd(data);
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

// --------------------- UpdateUserModal ---------------------
interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (user: Omit<User, "users">) => void;
  loadingUpdateUser: boolean;
}

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export function UpdateUserModal({
  isOpen,
  onClose,
  user,
  onUpdate,
  loadingUpdateUser,
}: UpdateUserModalProps) {
  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = (data: UpdateUserFormValues) => {
    onUpdate({ ...user, ...data });
  };

  useEffect(() => {
    if (!loadingUpdateUser) {
      form.reset();
      onClose();
    }
  }, [loadingUpdateUser]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <DialogFooter>
              <Button
                type="submit"
                disabled={loadingUpdateUser}
                className="w-full"
              >
                {loadingUpdateUser ? (
                  <ThreeDots
                    visible={true}
                    height="30"
                    width="30"
                    color="#fff"
                  />
                ) : (
                  "Update User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
