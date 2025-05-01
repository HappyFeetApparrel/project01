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
import { Replace } from "@/prisma/type";

// components
import { DeleteReplaceConfirmation } from "./delete-replace-confirmation";
import { ViewReplaceModal } from "./view-replace-modal";
import { UpdateReplaceModal } from "./update-replace-modal";
import { StatusPopup } from "@/components/global/status-popup";

// icons
import { Pencil, Trash2, Eye } from "lucide-react";

import { useReplaceContext } from "../provider/replace-provider";

import { useLayout } from "@/components/context/LayoutProvider";

export interface ReplaceCustom extends Replace {
  name: string;
  type: string;
  quantity: number;
  reason: string;
  return_id: number;
}

interface OptionsProps {
  row: ReplaceCustom;
}

const Options = ({ row }: OptionsProps) => {
  const { saveActivity } = useLayout();

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingUpdateReplace, setLoadingUpdateReplace] =
    useState<boolean>(false);

  const [loadingDeleteReplace, setLoadingDeleteReplace] =
    useState<boolean>(false);

  const replace = row;

  const { fetchReplaces } = useReplaceContext();

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const handleDeleteReplace = async () => {
    try {
      setLoadingDeleteReplace(true);
      // Call the delete API
      const response = await api.delete("/product-returns", {
        data: { return_id: replace.return_id },
      });
      setLoadingDeleteReplace(false);

      if (response.status === 200) {
        fetchReplaces();
        // Update the local replaces state
        saveActivity(`Deleted replace: ${replace.reason}`, "deleted");

        showStatusPopup("Replace deleted successfully", "success");
      }
    } catch (error) {
      setLoadingDeleteReplace(false);

      console.error("Error deleting replace:", error);
      showStatusPopup("Failed to delete replace", "error");
    }
  };

  const handleUpdateReplace = async (
    updatedReplace: Omit<Replace, "replaces">
  ) => {
    try {
      setLoadingUpdateReplace(true);
      // Call the update API
      updatedReplace.return_id = replace.return_id;
      const response = await api.put("/product-returns", updatedReplace);
      setLoadingUpdateReplace(false);

      if (response.status === 200) {
        fetchReplaces();
        saveActivity(`Updated replace: ${replace.reason}`, "updated");

        showStatusPopup("Replace updated successfully", "success");
      }
    } catch (error) {
      setLoadingUpdateReplace(false);
      console.error("Error updating replace:", error);
      showStatusPopup("Failed to update replace", "error");
    }
  };

  useEffect(() => {
    if (!loadingDeleteReplace) {
      setIsDeleteConfirmationOpen(false);
    }
  }, [loadingDeleteReplace]);

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
      <ViewReplaceModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        replace={replace}
      />
      <UpdateReplaceModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={(updatedReplace) => handleUpdateReplace(updatedReplace)}
        replace={replace}
        loadingUpdateReplace={loadingUpdateReplace}
      />
      <DeleteReplaceConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteReplace();
        }}
        replaceName={replace.reason}
        loadingDeleteReplace={loadingDeleteReplace}
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
