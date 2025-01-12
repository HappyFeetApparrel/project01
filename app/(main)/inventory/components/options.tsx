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
import { Product } from "@/prisma/type";

// components
import { DeleteProductConfirmation } from "./delete-product-confirmation";
import { ViewProductModal } from "./view-product-modal";
import { UpdateProductModal } from "./update-product-modal";
import { StatusPopup } from "@/components/global/status-popup";

// icons
import { Pencil, Trash2, Eye } from "lucide-react";

import { useProductContext } from "../provider/product-provider";

interface OptionsProps {
  row: Product;
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

  const [loadingUpdateProduct, setLoadingUpdateProduct] =
    useState<boolean>(false);

  const [loadingDeleteProduct, setLoadingDeleteProduct] =
    useState<boolean>(false);

  const product = row;

  const { fetchProducts } = useProductContext();

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleDeleteProduct = async () => {
    try {
      setLoadingDeleteProduct(true);
      // Call the delete API
      const response = await api.delete("/products", {
        data: { product_id: product.product_id },
      });
      setLoadingDeleteProduct(false);

      if (response.status === 200) {
        fetchProducts();
        // Update the local products state
        showStatusPopup("Product deleted successfully", "success");
      }
    } catch (error) {
      setLoadingDeleteProduct(false);

      console.error("Error deleting product:", error);
      showStatusPopup("Failed to delete product", "error");
    }
  };

  const handleUpdateProduct = async (
    updatedProduct: Omit<Product, "products">
  ) => {
    try {
      setLoadingUpdateProduct(true);
      // Call the update API
      updatedProduct.product_id = product.product_id;
      const response = await api.put("/products", updatedProduct);
      setLoadingUpdateProduct(false);

      if (response.status === 200) {
        fetchProducts();
        showStatusPopup("Product updated successfully", "success");
      }
    } catch (error) {
      setLoadingUpdateProduct(false);
      console.error("Error updating product:", error);
      showStatusPopup("Failed to update product", "error");
    }
  };

  useEffect(() => {
    if (!loadingDeleteProduct) {
      setIsDeleteConfirmationOpen(false);
    }
  }, [loadingDeleteProduct]);

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
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={product}
      />
      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={(updatedProduct) => handleUpdateProduct(updatedProduct)}
        product={product}
        loadingUpdateProduct={loadingUpdateProduct}
      />
      <DeleteProductConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteProduct();
        }}
        product={product}
        loadingDeleteProduct={loadingDeleteProduct}
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
