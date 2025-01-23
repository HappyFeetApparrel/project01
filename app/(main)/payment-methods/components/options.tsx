"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// types
import { PaymentMethod } from "@/prisma/type";

// components
import { DeletePaymentMethodConfirmation } from "./delete-payment-method-confirmation";
import { ViewPaymentMethodModal } from "./view-payment-method-modal";
import { UpdatePaymentMethodModal } from "./update-payment-method-modal";
import { StatusPopup } from "@/components/global/status-popup";

// icons
import { Pencil, Trash2, Eye } from "lucide-react";

import { usePaymentMethodContext } from "../provider/payment-method-provider";

interface OptionsProps {
  row: PaymentMethod;
}

const Options = ({ row }: OptionsProps) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingUpdatePaymentMethod, setLoadingUpdatePaymentMethod] =
    useState<boolean>(false);

  const [loadingDeletePaymentMethod, setLoadingDeletePaymentMethod] =
    useState<boolean>(false);

  const paymentMethod = row;

  const { fetchPaymentMethods } = usePaymentMethodContext();

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleDeletePaymentMethod = async () => {
    try {
      setLoadingDeletePaymentMethod(true);
      // Call the delete API
      const response = await api.delete("/payment-methods", {
        data: { payment_method_id: paymentMethod.payment_method_id },
      });
      setLoadingDeletePaymentMethod(false);

      if (response.status === 200) {
        fetchPaymentMethods();
        // Update the local paymentMethods state
        showStatusPopup("PaymentMethod deleted successfully", "success");
      }
    } catch (error) {
      setLoadingDeletePaymentMethod(false);

      console.error("Error deleting paymentMethod:", error);
      showStatusPopup("Failed to delete paymentMethod", "error");
    }
  };

  const handleUpdatePaymentMethod = async (
    updatedPaymentMethod: Omit<PaymentMethod, "paymentMethods">
  ) => {
    try {
      setLoadingUpdatePaymentMethod(true);
      // Call the update API
      updatedPaymentMethod.payment_method_id = paymentMethod.payment_method_id;
      const response = await api.put("/payment-methods", updatedPaymentMethod);
      setLoadingUpdatePaymentMethod(false);

      if (response.status === 200) {
        fetchPaymentMethods();
        showStatusPopup("PaymentMethod updated successfully", "success");
      }
    } catch (error) {
      setLoadingUpdatePaymentMethod(false);
      console.error("Error updating paymentMethod:", error);
      showStatusPopup("Failed to update paymentMethod", "error");
    }
  };

  useEffect(() => {
    if (!loadingDeletePaymentMethod) {
      setIsDeleteConfirmationOpen(false);
    }
  }, [loadingDeletePaymentMethod]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsViewModalOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsUpdateModalOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsDeleteConfirmationOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewPaymentMethodModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        paymentMethod={paymentMethod}
      />
      <UpdatePaymentMethodModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={(updatedPaymentMethod) =>
          handleUpdatePaymentMethod(updatedPaymentMethod)
        }
        paymentMethod={paymentMethod}
        loadingUpdatePaymentMethod={loadingUpdatePaymentMethod}
      />
      <DeletePaymentMethodConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDeletePaymentMethod();
        }}
        paymentMethodName={paymentMethod.name}
        loadingDeletePaymentMethod={loadingDeletePaymentMethod}
      />
      <StatusPopup
        isOpen={isStatusPopupOpen}
        onClose={() => setIsStatusPopupOpen(false)}
        message={statusPopupMessage}
        status={statusPopupStatus}
      />
    </>
  );
};

export default Options;
