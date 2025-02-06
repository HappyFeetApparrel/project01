"use client";
// import axios
import { api } from "@/lib/axios";

import { useState } from "react";

// components
import { AddPaymentMethodModal } from "./add-payment-method-modal";
import { StatusPopup } from "@/components/global/status-popup";

// types
import { PaymentMethod } from "@/prisma/type";

import { useLayout } from "@/components/context/LayoutProvider";

// components
import PaymentMethodTable from "./payment-method-table";

import { columns } from "./columns";

import { usePaymentMethodContext } from "../provider/payment-method-provider";

export default function PaymentMethods() {
  // const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  // const fetchPaymentMethods = async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await api.get("/payment-methods");
  //     setPaymentMethods(data.data);
  //   } catch (err) {
  //     setError("Failed to load paymentMethods. Please try again.");
  //     console.error("Error fetching paymentMethods:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchPaymentMethods();
  // }, []);

  const { paymentMethods, loading, error, fetchPaymentMethods } =
    usePaymentMethodContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState("");
  const [statusPopupStatus, setStatusPopupStatus] = useState<
    "success" | "error"
  >("success");

  const [loadingAddPaymentMethod, setLoadingAddPaymentMethod] =
    useState<boolean>(false);

  const showStatusPopup = (message: string, status: "success" | "error") => {
    setStatusPopupMessage(message);
    setStatusPopupStatus(status);
    setIsStatusPopupOpen(true);
  };

  const { saveActivity } = useLayout();
  const handleAddPaymentMethod = async (
    newPaymentMethod: Pick<PaymentMethod, "name" | "description">
  ) => {
    try {
      setLoadingAddPaymentMethod(true);
      const response = await api.post("/payment-methods", newPaymentMethod);
      setLoadingAddPaymentMethod(false);

      if (response.status === 201) {
        console.log("PaymentMethod added:", response.data.data);
        saveActivity(`Added payment method: ${newPaymentMethod.name}`, "added");
        showStatusPopup("PaymentMethod added successfully", "success");
      } else {
        console.error("Unexpected response:", response);
        showStatusPopup(
          "Unexpected response while adding paymentMethod",
          "error"
        );
      }
      await fetchPaymentMethods(); // Refresh data after addition
    } catch (error: unknown) {
      setLoadingAddPaymentMethod(false);
      if (error instanceof Error) {
        console.error("Error adding paymentMethod:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      showStatusPopup("An unexpected error occurred", "error");
    }
  };

  return (
    <>
      <PaymentMethodTable
        columns={columns}
        data={paymentMethods}
        loading={loading}
        error={error}
        setIsAddModalOpen={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <AddPaymentMethodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (paymentMethod) => {
          await handleAddPaymentMethod(paymentMethod);
        }}
        loadingAddPaymentMethod={loadingAddPaymentMethod}
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
