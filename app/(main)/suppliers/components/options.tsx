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
import { Supplier } from "@/prisma/type";

// components
import { DeleteSupplierConfirmation } from "./delete-supplier-confirmation";
import { ViewSupplierModal } from "./view-supplier-modal";
import { UpdateSupplierModal } from "./update-supplier-modal";
import { StatusPopup } from "@/components/global/status-popup";

// icons
import { Pencil, Trash2, Eye } from "lucide-react";

import { useSupplierContext } from "../provider/supplier-provider";

import { useLayout } from "@/components/context/LayoutProvider";

interface OptionsProps {
  row: Supplier;
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

  const [loadingUpdateSupplier, setLoadingUpdateSupplier] =
    useState<boolean>(false);

  const [loadingDeleteSupplier, setLoadingDeleteSupplier] =
    useState<boolean>(false);

  const supplier = row;

  const { fetchSuppliers } = useSupplierContext();

  const { saveActivity } = useLayout();

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleDeleteSupplier = async () => {
    try {
      setLoadingDeleteSupplier(true);
      // Call the delete API
      const response = await api.delete("/suppliers", {
        data: { supplier_id: supplier.supplier_id },
      });
      setLoadingDeleteSupplier(false);

      if (response.status === 200) {
        fetchSuppliers();

        saveActivity(`Deleted supplier: ${supplier.name}`, "deleted");

        // Update the local suppliers state
        showStatusPopup("Supplier deleted successfully", "success");
      }
    } catch (error) {
      setLoadingDeleteSupplier(false);

      console.error("Error deleting supplier:", error);
      showStatusPopup("Failed to delete supplier", "error");
    }
  };

  const handleUpdateSupplier = async (
    updatedSupplier: Omit<Supplier, "suppliers">
  ) => {
    try {
      setLoadingUpdateSupplier(true);
      // Call the update API
      updatedSupplier.supplier_id = supplier.supplier_id;
      const response = await api.put("/suppliers", updatedSupplier);
      setLoadingUpdateSupplier(false);

      if (response.status === 200) {
        fetchSuppliers();
        saveActivity(`Updated supplier: ${supplier.name}`, "updated");

        showStatusPopup("Supplier updated successfully", "success");
      }
    } catch (error) {
      setLoadingUpdateSupplier(false);
      console.error("Error updating supplier:", error);
      showStatusPopup("Failed to update supplier", "error");
    }
  };

  useEffect(() => {
    if (!loadingDeleteSupplier) {
      setIsDeleteConfirmationOpen(false);
    }
  }, [loadingDeleteSupplier]);

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
      <ViewSupplierModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        supplier={supplier}
      />
      <UpdateSupplierModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={(updatedSupplier) => handleUpdateSupplier(updatedSupplier)}
        supplier={supplier}
        loadingUpdateSupplier={loadingUpdateSupplier}
      />
      <DeleteSupplierConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteSupplier();
        }}
        supplierName={supplier.name}
        loadingDeleteSupplier={loadingDeleteSupplier}
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
