"use client";
// import axios
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

// components
import { AddReplaceModal } from "./add-replace-modal";
import { StatusPopup } from "@/components/global/status-popup";

// types
import { Replace } from "@/prisma/type";

// components
import ReplaceTable from "./replace-table";

import { columns } from "./columns";

import { useReplaceContext } from "../provider/replace-provider";

import { useLayout } from "@/components/context/LayoutProvider";

export default function Replaces() {
  const { saveActivity } = useLayout();
  const router = useRouter();
  const { replaces, loading, error, fetchReplaces } = useReplaceContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddReplace, setLoadingAddReplace] = useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddReplace = async (newReplace: Pick<Replace, "reason">) => {
    try {
      setLoadingAddReplace(true);
      const response = await api.post("/product-returns", newReplace);
      setLoadingAddReplace(false);

      if (response.status === 201) {
        saveActivity(`Added replace: ${newReplace.reason}`, "added");
        if (newReplace.reason === "Replace") {
          router.push(response.data.data.redirect_url);
        } else {
          showStatusPopup("Replace added successfully", "success");
        }
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding replace", "error");
      }
      await fetchReplaces(); // Refresh data after addition
    } catch (error: unknown) {
      setLoadingAddReplace(false);
      showStatusPopup("Return quantity exceeds available stock.", "error");
    }
  };

  return (
    <>
      <ReplaceTable
        columns={columns}
        data={replaces}
        loading={loading}
        error={error}
        setIsAddModalOpen={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <AddReplaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (replace) => {
          await handleAddReplace(replace);
        }}
        loadingAddReplace={loadingAddReplace}
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
