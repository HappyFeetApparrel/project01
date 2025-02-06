"use client";
// import axios
import { api } from "@/lib/axios";

import { useEffect, useState } from "react";

// components
import { AddSupplierModal } from "./add-supplier-modal";
import { StatusPopup } from "@/components/global/status-popup";

// types
import { Supplier } from "@/prisma/type";

// components
import { SupplierTable } from "./supplier-table";

import { columns } from "./columns";

import { useSupplierContext } from "../provider/supplier-provider";

import { useLayout } from "@/components/context/LayoutProvider";

export default function Suppliers() {
  const { saveActivity, supplier, setCreateSupplier } = useLayout();

  const { suppliers, loading, error, fetchSuppliers } = useSupplierContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddSupplier, setLoadingAddSupplier] = useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddSupplier = async (
    newSupplier: Omit<Supplier, "supplier_id" | "products">
  ) => {
    try {
      setLoadingAddSupplier(true);
      const response = await api.post("/suppliers", newSupplier);
      setLoadingAddSupplier(false);

      if (response.status === 200) {
        console.log("Supplier added:", response.data.data);
        saveActivity(`Added supplier: ${newSupplier.name}`, "added");

        showStatusPopup("Supplier added successfully", "success");
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding supplier", "error");
      }
      await fetchSuppliers(); // Refresh data after addition
    } catch (error: unknown) {
      setLoadingAddSupplier(false);
      if (error instanceof Error) {
        console.error("Error adding supplier:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      showStatusPopup("An unexpected error occurred", "error");
    }
  };

  useEffect(() => {
    if (supplier) {
      setIsAddModalOpen(true);
      setCreateSupplier(false);
    }
  }, [supplier]);

  return (
    <>
      <SupplierTable
        columns={columns}
        data={suppliers}
        loading={loading}
        error={error}
        setIsAddModalOpen={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (supplier) => {
          await handleAddSupplier(supplier);
        }}
        loadingAddSupplier={loadingAddSupplier}
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
