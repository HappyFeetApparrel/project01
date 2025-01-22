"use client";
// import axios
import { api } from "@/lib/axios";

import { useState } from "react";

// components
import { AddBrandModal } from "./add-brand-modal";
import { StatusPopup } from "@/components/global/status-popup";

// types
import { Brand } from "@/prisma/type";

// components
import BrandTable from "./brand-table";

import { columns } from "./columns";

import { useBrandContext } from "../provider/brand-provider";

export default function Brands() {
  // const [brands, setBrands] = useState<Brand[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  // const fetchBrands = async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await api.get("/brands");
  //     setBrands(data.data);
  //   } catch (err) {
  //     setError("Failed to load brands. Please try again.");
  //     console.error("Error fetching brands:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchBrands();
  // }, []);

  const { brands, loading, error, fetchBrands } = useBrandContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddBrand, setLoadingAddBrand] = useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddBrand = async (
    newBrand: Pick<Brand, "name" | "description">
  ) => {
    try {
      setLoadingAddBrand(true);
      const response = await api.post("/brands", newBrand);
      setLoadingAddBrand(false);

      if (response.status === 201) {
        console.log("Brand added:", response.data.data);
        showStatusPopup("Brand added successfully", "success");
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding brand", "error");
      }
      await fetchBrands(); // Refresh data after addition
    } catch (error: unknown) {
      setLoadingAddBrand(false);
      if (error instanceof Error) {
        console.error("Error adding brand:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      showStatusPopup("An unexpected error occurred", "error");
    }
  };

  return (
    <>
      <BrandTable
        columns={columns}
        data={brands}
        loading={loading}
        error={error}
        setIsAddModalOpen={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (brand) => {
          await handleAddBrand(brand);
        }}
        loadingAddBrand={loadingAddBrand}
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
