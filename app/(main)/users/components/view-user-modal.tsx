"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/prisma/type";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function ViewUserModal({ isOpen, onClose, user }: ViewUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <dl className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <dt className="font-semibold">User ID:</dt>
              <dd>{user.user_id}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Name:</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Role:</dt>
              <dd>{user.role}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Email Address:</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Created At:</dt>
              <dd>{user.created_at.toLocaleString()}</dd>
            </div>
            <div className="col-span-1">
              <dt className="font-semibold">Updated At:</dt>
              <dd>{user.updated_at.toLocaleString()}</dd>
            </div>
            <div className="col-span-2">
              <dt className="font-semibold">Orders:</dt>
              <dd>
                {user.orders.length > 0
                  ? `${user.orders.length} orders`
                  : "No orders"}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="font-semibold">Inventory Adjustments:</dt>
              <dd>
                {user.adjustments.length > 0
                  ? `${user.adjustments.length} adjustments`
                  : "No adjustments"}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="font-semibold">Activity Logs:</dt>
              <dd>
                {user.logs.length > 0
                  ? `${user.logs.length} logs`
                  : "No activity logs"}
              </dd>
            </div>
          </dl>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="min-w-[50%]">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
