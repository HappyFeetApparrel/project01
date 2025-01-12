"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "../types/user";

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (supplier: User) => void;
  supplier: User;
}

export function UpdateUserModal({
  isOpen,
  onClose,
  onUpdate,
  supplier,
}: UpdateUserModalProps) {
  const [updatedUser, setUpdatedUser] = useState<User>(supplier);

  useEffect(() => {
    setUpdatedUser(supplier);
  }, [supplier]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(updatedUser);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={updatedUser.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">
                Contact Person
              </Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={updatedUser.contactPerson}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={updatedUser.phoneNumber}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emailAddress" className="text-right">
                Email Address
              </Label>
              <Input
                id="emailAddress"
                name="emailAddress"
                type="email"
                value={updatedUser.emailAddress}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Textarea
                id="address"
                name="address"
                value={updatedUser.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suppliedProducts" className="text-right">
                Supplied Products
              </Label>
              <Input
                id="suppliedProducts"
                name="suppliedProducts"
                value={updatedUser.suppliedProducts.join(", ")}
                onChange={(e) =>
                  setUpdatedUser((prev) => ({
                    ...prev,
                    suppliedProducts: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  }))
                }
                className="col-span-3"
                placeholder="Enter products separated by commas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
