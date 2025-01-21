"use client";
// import axios
import { api } from "@/lib/axios";

import { useState } from "react";

// components
import { AddCategoryModal } from "./add-category-modal";
import { StatusPopup } from "@/components/global/status-popup";

// types
import { Category } from "@/prisma/type";

// components
import CategoryTable from "./category-table";

import { columns } from "./columns";

import { useCategoryContext } from "../provider/category-provider";

export default function Categories() {
  // const [categories, setCategories] = useState<Category[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  // const fetchCategories = async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await api.get("/categories");
  //     setCategories(data.data);
  //   } catch (err) {
  //     setError("Failed to load categories. Please try again.");
  //     console.error("Error fetching categories:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  const { categories, loading, error, fetchCategories } = useCategoryContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddCategory, setLoadingAddCategory] = useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddCategory = async (
    newCategory: Pick<Category, "name" | "description">
  ) => {
    try {
      setLoadingAddCategory(true);
      const response = await api.post("/categories", newCategory);
      setLoadingAddCategory(false);

      if (response.status === 200) {
        console.log("Category added:", response.data.data);
        showStatusPopup("Category added successfully", "success");
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding category", "error");
      }
      await fetchCategories(); // Refresh data after addition
    } catch (error: unknown) {
      setLoadingAddCategory(false);
      if (error instanceof Error) {
        console.error("Error adding category:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      showStatusPopup("An unexpected error occurred", "error");
    }
  };

  return (
    <>
      <CategoryTable
        columns={columns}
        data={categories}
        loading={loading}
        error={error}
        setIsAddModalOpen={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (category) => {
          await handleAddCategory(category);
        }}
        loadingAddCategory={loadingAddCategory}
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
