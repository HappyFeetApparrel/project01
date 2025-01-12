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
import { User } from "@/prisma/type";

// components
import { DeleteUserConfirmation } from "./delete-user-confirmation";
import { ViewUserModal } from "./view-user-modal";
import { UpdateUserModal } from "./update-user-modal";
import { StatusPopup } from "@/components/global/status-popup";

// icons
import { Pencil, Trash2, Eye } from "lucide-react";

import { useUserContext } from "../provider/user-provider";

interface OptionsProps {
  row: User;
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

  const [loadingUpdateUser, setLoadingUpdateUser] = useState<boolean>(false);

  const [loadingDeleteUser, setLoadingDeleteUser] = useState<boolean>(false);

  const user = row;

  const { fetchUsers } = useUserContext();

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      setLoadingDeleteUser(true);
      // Call the delete API
      const response = await api.delete("/users", {
        data: { user_id: user.user_id },
      });
      setLoadingDeleteUser(false);

      if (response.status === 200) {
        fetchUsers();
        // Update the local users state
        showStatusPopup("User deleted successfully", "success");
      }
    } catch (error) {
      setLoadingDeleteUser(false);

      console.error("Error deleting user:", error);
      showStatusPopup("Failed to delete user", "error");
    }
  };

  const handleUpdateUser = async (updatedUser: Omit<User, "users">) => {
    try {
      setLoadingUpdateUser(true);
      // Call the update API
      updatedUser.user_id = user.user_id;
      const response = await api.put("/users", updatedUser);
      setLoadingUpdateUser(false);

      if (response.status === 200) {
        fetchUsers();
        showStatusPopup("User updated successfully", "success");
      }
    } catch (error) {
      setLoadingUpdateUser(false);
      console.error("Error updating user:", error);
      showStatusPopup("Failed to update user", "error");
    }
  };

  useEffect(() => {
    if (!loadingDeleteUser) {
      setIsDeleteConfirmationOpen(false);
    }
  }, [loadingDeleteUser]);

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
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={user}
      />
      <UpdateUserModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={(updatedUser) => handleUpdateUser(updatedUser)}
        user={user}
        loadingUpdateUser={loadingUpdateUser}
      />
      <DeleteUserConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteUser();
        }}
        userName={user.name}
        loadingDeleteUser={loadingDeleteUser}
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
