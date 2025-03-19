"use client";
// import axios
import { api } from "@/lib/axios";

import { useState } from "react";

// components
import { AddProductReturnModal } from "./add-product-return-modal";
import { StatusPopup } from "@/components/global/status-popup";

// types
import { ProductReturn } from "@/prisma/type";

// components
import ProductReturnTable from "./product-return-table";

import { columns } from "./columns";

import { useProductReturnContext } from "../provider/product-return-provider";

import { useLayout } from "@/components/context/LayoutProvider";

export default function ProductReturns() {
  const { saveActivity } = useLayout();

  const { productReturns, loading, error, fetchProductReturns } = useProductReturnContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddProductReturn, setLoadingAddProductReturn] = useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddProductReturn = async (
    newProductReturn: Pick<ProductReturn, "reason">
  ) => {
    try {
      setLoadingAddProductReturn(true);
      const response = await api.post("/product-returns", newProductReturn);
      setLoadingAddProductReturn(false);

      if (response.status === 201) {
        console.log("ProductReturn added:", response.data.data);
        saveActivity(`Added productReturn: ${newProductReturn.reason}`, "added");

        showStatusPopup("ProductReturn added successfully", "success");
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding productReturn", "error");
      }
      await fetchProductReturns(); // Refresh data after addition
    } catch (error: unknown) {
      setLoadingAddProductReturn(false);
      showStatusPopup("Return quantity exceeds available stock.", "error");
    }

    console.log(newProductReturn);
  };

  return (
    <>
      <ProductReturnTable
        columns={columns}
        data={productReturns}
        loading={loading}
        error={error}
        setIsAddModalOpen={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <AddProductReturnModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (productReturn) => {
          await handleAddProductReturn(productReturn);
        }}
        loadingAddProductReturn={loadingAddProductReturn}
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
