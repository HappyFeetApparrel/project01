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
import { Brand } from "@/prisma/type";

// components
import { DeleteBrandConfirmation } from "./delete-brand-confirmation";
import { ViewBrandModal } from "./view-brand-modal";
import { UpdateBrandModal } from "./update-brand-modal";
import { StatusPopup } from "@/components/global/status-popup";

// icons
import { Pencil, Trash2, Eye } from "lucide-react";

import { useBrandContext } from "../provider/brand-provider";

interface OptionsProps {
  row: Brand;
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

  const [loadingUpdateBrand, setLoadingUpdateBrand] = useState<boolean>(false);

  const [loadingDeleteBrand, setLoadingDeleteBrand] = useState<boolean>(false);

  const brand = row;

  const { fetchBrands } = useBrandContext();

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleDeleteBrand = async () => {
    try {
      setLoadingDeleteBrand(true);
      // Call the delete API
      const response = await api.delete("/brands", {
        data: { brand_id: brand.brand_id },
      });
      setLoadingDeleteBrand(false);

      if (response.status === 200) {
        fetchBrands();
        // Update the local brands state
        showStatusPopup("Brand deleted successfully", "success");
      }
    } catch (error) {
      setLoadingDeleteBrand(false);

      console.error("Error deleting brand:", error);
      showStatusPopup("Failed to delete brand", "error");
    }
  };

  const handleUpdateBrand = async (updatedBrand: Omit<Brand, "brands">) => {
    try {
      setLoadingUpdateBrand(true);
      // Call the update API
      updatedBrand.brand_id = brand.brand_id;
      const response = await api.put("/brands", updatedBrand);
      setLoadingUpdateBrand(false);

      if (response.status === 200) {
        fetchBrands();
        showStatusPopup("Brand updated successfully", "success");
      }
    } catch (error) {
      setLoadingUpdateBrand(false);
      console.error("Error updating brand:", error);
      showStatusPopup("Failed to update brand", "error");
    }
  };

  useEffect(() => {
    if (!loadingDeleteBrand) {
      setIsDeleteConfirmationOpen(false);
    }
  }, [loadingDeleteBrand]);

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
      <ViewBrandModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        brand={brand}
      />
      <UpdateBrandModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={(updatedBrand) => handleUpdateBrand(updatedBrand)}
        brand={brand}
        loadingUpdateBrand={loadingUpdateBrand}
      />
      <DeleteBrandConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteBrand();
        }}
        brandName={brand.name}
        loadingDeleteBrand={loadingDeleteBrand}
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
