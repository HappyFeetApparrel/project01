"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { PaymentMethod } from "@/prisma/type";
import { api } from "@/lib/axios";

// Define the context type
interface PaymentMethodContextType {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string;
  setPaymentMethods: (paymentMethods: PaymentMethod[]) => void;
  fetchPaymentMethods: () => Promise<void>;
}

// Create the context
const PaymentMethodContext = createContext<
  PaymentMethodContextType | undefined
>(undefined);

// PaymentMethodProvider Component
export const PaymentMethodProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/payment-methods");
      setPaymentMethods(data.data);
    } catch (err) {
      setError("Failed to load paymentMethods. Please try again.");
      console.error("Error fetching paymentMethods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <PaymentMethodContext.Provider
      value={{
        paymentMethods,
        loading,
        error,
        setPaymentMethods,
        fetchPaymentMethods,
      }}
    >
      {children}
    </PaymentMethodContext.Provider>
  );
};

// Custom hook for using the context
export const usePaymentMethodContext = () => {
  const context = useContext(PaymentMethodContext);
  if (!context) {
    throw new Error(
      "usePaymentMethodContext must be used within a PaymentMethodProvider"
    );
  }
  return context;
};
