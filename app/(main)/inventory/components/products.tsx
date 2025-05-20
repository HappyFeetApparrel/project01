"use client";
// import axios
import { api } from "@/lib/axios";

import { useEffect, useState } from "react";

// components
import { AddProductModal } from "./add-product-modal";
import { StatusPopup } from "@/components/global/status-popup";

import { useLayout } from "@/components/context/LayoutProvider";

import StockReports from "../../dashboard/components/StockReports";

// types
import { Product } from "@/prisma/type";

// components
import { ProductTable } from "./product-table";

import { columns } from "./columns";

import { useProductContext } from "../provider/product-provider";

export default function Products() {
  const { products, loading, error, fetchProducts } = useProductContext();

  const { saveActivity, product, setCreateProduct } = useLayout();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddProduct, setLoadingAddProduct] = useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddProduct = async (
    newProduct: Omit<Product, "product_id" | "order_items" | "adjustments">
  ) => {
    try {
      setLoadingAddProduct(true);
      const response = await api.post("/products", newProduct);
      setLoadingAddProduct(false);

      if (response.status === 201) {
        saveActivity("Add Product", "Product added successfully");
        showStatusPopup("Product added successfully", "success");
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding product", "error");
      }
      await fetchProducts(); // Refresh data after addition
    } catch (error: unknown) {
      setLoadingAddProduct(false);
      if (error instanceof Error) {
        console.error("Error adding product:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      showStatusPopup("An unexpected error occurred", "error");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (product) {
      setIsAddModalOpen(true);
      setCreateProduct(false);
    }
  }, [product]);

  useEffect(() => {}, [isAddModalOpen]);

  return (
    <>
      <ProductTable
        columns={columns}
        data={products}
        loading={loading}
        error={error}
        setIsAddModalOpen={() => setIsAddModalOpen(true)}
      />

      <StockReports className="md:px-0" />

      {/* Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (product) => {
          await handleAddProduct(product);
        }}
        loadingAddProduct={loadingAddProduct}
      />

      <StatusPopup
        isOpen={isStatusPopupOpen}
        onClose={() => setIsStatusPopupOpen(false)}
        message={statusPopupMessage}
        status={statusPopupStatus}
      />
    </>
  );
}
