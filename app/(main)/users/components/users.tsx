"use client";
// import axios
import { api } from "@/lib/axios";

import { useState } from "react";

// components
import { AddUserModal } from "./add-user-modal";
import { StatusPopup } from "@/components/global/status-popup";

// types
import { User } from "@/prisma/type";

// components
import { UserTable } from "./user-table";

import { columns } from "./columns";

import { useUserContext } from "../provider/user-provider";

import { useLayout } from "@/components/context/LayoutProvider";

export default function Users() {
  const { saveActivity } = useLayout();

  const { users, loading, error, fetchUsers } = useUserContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddUser, setLoadingAddUser] = useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleAddUser = async (
    newUser: Omit<
      User,
      | "user_id"
      | "created_at"
      | "updated_at"
      | "orders"
      | "adjustments"
      | "logs"
    >
  ) => {
    try {
      setLoadingAddUser(true);
      const response = await api.post("/users", newUser);
      setLoadingAddUser(false);

      if (response.status === 201) {
        saveActivity(`Added user: ${newUser.name}`, "added");

        showStatusPopup("User added successfully", "success");
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup("Unexpected response while adding user", "error");
      }
      await fetchUsers(); // Refresh data after addition
    } catch (error: unknown) {
      setLoadingAddUser(false);
      if (error instanceof Error) {
        console.error("Error adding user:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      showStatusPopup("An unexpected error occurred", "error");
    }
  };

  return (
    <>
      <UserTable
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        setIsAddModalOpen={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (user) => {
          await handleAddUser(user);
        }}
        loadingAddUser={loadingAddUser}
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
