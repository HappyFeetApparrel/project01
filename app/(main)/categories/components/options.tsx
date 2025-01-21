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
import { Category } from "@/prisma/type";

// components
import { DeleteCategoryConfirmation } from "./delete-category-confirmation";
import { ViewCategoryModal } from "./view-category-modal";
import { UpdateCategoryModal } from "./update-category-modal";
import { StatusPopup } from "@/components/global/status-popup";

// icons
import { Pencil, Trash2, Eye } from "lucide-react";

import { useCategoryContext } from "../provider/category-provider";

interface OptionsProps {
  row: Category;
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

  const [loadingUpdateCategory, setLoadingUpdateCategory] =
    useState<boolean>(false);

  const [loadingDeleteCategory, setLoadingDeleteCategory] =
    useState<boolean>(false);

  const category = row;

  const { fetchCategories } = useCategoryContext();

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleDeleteCategory = async () => {
    try {
      setLoadingDeleteCategory(true);
      // Call the delete API
      const response = await api.delete("/categories", {
        data: { category_id: category.category_id },
      });
      setLoadingDeleteCategory(false);

      if (response.status === 200) {
        fetchCategories();
        // Update the local categories state
        showStatusPopup("Category deleted successfully", "success");
      }
    } catch (error) {
      setLoadingDeleteCategory(false);

      console.error("Error deleting category:", error);
      showStatusPopup("Failed to delete category", "error");
    }
  };

  const handleUpdateCategory = async (
    updatedCategory: Omit<Category, "categories">
  ) => {
    try {
      setLoadingUpdateCategory(true);
      // Call the update API
      updatedCategory.category_id = category.category_id;
      const response = await api.put("/categories", updatedCategory);
      setLoadingUpdateCategory(false);

      if (response.status === 200) {
        fetchCategories();
        showStatusPopup("Category updated successfully", "success");
      }
    } catch (error) {
      setLoadingUpdateCategory(false);
      console.error("Error updating category:", error);
      showStatusPopup("Failed to update category", "error");
    }
  };

  useEffect(() => {
    if (!loadingDeleteCategory) {
      setIsDeleteConfirmationOpen(false);
    }
  }, [loadingDeleteCategory]);

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
      <ViewCategoryModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        category={category}
      />
      <UpdateCategoryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={(updatedCategory) => handleUpdateCategory(updatedCategory)}
        category={category}
        loadingUpdateCategory={loadingUpdateCategory}
      />
      <DeleteCategoryConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteCategory();
        }}
        categoryName={category.name}
        loadingDeleteCategory={loadingDeleteCategory}
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
