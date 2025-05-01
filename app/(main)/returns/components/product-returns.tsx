"use client";
// import axios
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

// components
import { AddProductReturnModal } from "./add-returns-modal";
import { StatusPopup } from "@/components/global/status-popup";

// types
import { Returns } from "@/prisma/type";

// components
import ProductReturnTable from "./returns-table";

import { columns } from "./columns";

import { useProductReturnContext } from "../provider/returns-provider";

import { useLayout } from "@/components/context/LayoutProvider";

export default function ProductReturns() {
  const { saveActivity } = useLayout();
  const router = useRouter();
  const { productReturns, loading, error, fetchProductReturns } =
    useProductReturnContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddProductReturn, setLoadingAddProductReturn] =
    useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddProductReturn = async (
    newProductReturn: Pick<Returns, "reason">
  ) => {
    try {
      setLoadingAddProductReturn(true);
      const response = await api.post("/returns", newProductReturn);
      setLoadingAddProductReturn(false);

      if (response.status === 201) {
        saveActivity(`Added returns: ${newProductReturn.reason}`, "added");
        if (newProductReturn.reason === "Replace") {
          router.push(response.data.data.redirect_url);
        } else {
          showStatusPopup("Returns added successfully", "success");
        }
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding returns", "error");
      }
      await fetchProductReturns(); // Refresh data after addition
    } catch (error: unknown) {
      setLoadingAddProductReturn(false);
      showStatusPopup("Return quantity exceeds available stock.", "error");
    }
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
        onAdd={async (returns) => {
          await handleAddProductReturn(returns);
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
