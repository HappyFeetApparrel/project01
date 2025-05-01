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
import { Returns } from "@/prisma/type";

// components
import { DeleteProductReturnConfirmation } from "./delete-returns-confirmation";
import { ViewProductReturnModal } from "./view-returns-modal";
import { UpdateProductReturnModal } from "./update-returns-modal";
import { StatusPopup } from "@/components/global/status-popup";

// icons
import { Pencil, Trash2, Eye } from "lucide-react";

import { useProductReturnContext } from "../provider/returns-provider";

import { useLayout } from "@/components/context/LayoutProvider";

export interface ProductReturnCustom extends Returns {
  name: string;
  type: string;
  quantity: number;
  reason: string;
  return_id: number;
}

interface OptionsProps {
  row: ProductReturnCustom;
}

const Options = ({ row }: OptionsProps) => {
  const { saveActivity } = useLayout();

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingUpdateProductReturn, setLoadingUpdateProductReturn] =
    useState<boolean>(false);

  const [loadingDeleteProductReturn, setLoadingDeleteProductReturn] =
    useState<boolean>(false);

  const returns = row;

  const { fetchProductReturns } = useProductReturnContext();

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleDeleteProductReturn = async () => {
    try {
      setLoadingDeleteProductReturn(true);
      // Call the delete API
      const response = await api.delete("/returns", {
        data: { return_id: returns.return_id },
      });
      setLoadingDeleteProductReturn(false);

      if (response.status === 200) {
        fetchProductReturns();
        // Update the local productReturns state
        saveActivity(`Deleted returns: ${returns.reason}`, "deleted");

        showStatusPopup("Returns deleted successfully", "success");
      }
    } catch (error) {
      setLoadingDeleteProductReturn(false);

      console.error("Error deleting returns:", error);
      showStatusPopup("Failed to delete returns", "error");
    }
  };

  const handleUpdateProductReturn = async (
    updatedProductReturn: Omit<Returns, "productReturns">
  ) => {
    try {
      setLoadingUpdateProductReturn(true);
      // Call the update API
      updatedProductReturn.return_id = returns.return_id;
      const response = await api.put("/returns", updatedProductReturn);
      setLoadingUpdateProductReturn(false);

      if (response.status === 200) {
        fetchProductReturns();
        saveActivity(`Updated returns: ${returns.reason}`, "updated");

        showStatusPopup("Returns updated successfully", "success");
      }
    } catch (error) {
      setLoadingUpdateProductReturn(false);
      console.error("Error updating returns:", error);
      showStatusPopup("Failed to update returns", "error");
    }
  };

  useEffect(() => {
    if (!loadingDeleteProductReturn) {
      setIsDeleteConfirmationOpen(false);
    }
  }, [loadingDeleteProductReturn]);

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
      <ViewProductReturnModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        returns={returns}
      />
      <UpdateProductReturnModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={(updatedProductReturn) =>
          handleUpdateProductReturn(updatedProductReturn)
        }
        returns={returns}
        loadingUpdateProductReturn={loadingUpdateProductReturn}
      />
      <DeleteProductReturnConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteProductReturn();
        }}
        productReturnName={returns.reason}
        loadingDeleteProductReturn={loadingDeleteProductReturn}
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
