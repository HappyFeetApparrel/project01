"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ProductReturn } from "@/prisma/type";
import { api } from "@/lib/axios";

import { ProductReturnCustom } from "../components/options";

// Define the context type
interface ProductReturnContextType {
  productReturns: ProductReturnCustom[];
  loading: boolean;
  error: string;
  setProductReturns: (productReturns: ProductReturnCustom[]) => void;
  fetchProductReturns: () => Promise<void>;
}

// Create the context
const ProductReturnContext = createContext<ProductReturnContextType | undefined>(undefined);

// ProductReturnProvider Component
export const ProductReturnProvider = ({ children }: { children: ReactNode }) => {
  const [productReturns, setProductReturns] = useState<ProductReturnCustom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProductReturns = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/product-returns");
      setProductReturns(data.data);
    } catch (err) {
      setError("Failed to load productReturns. Please try again.");
      console.error("Error fetching productReturns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductReturns();
  }, []);

  return (
    <ProductReturnContext.Provider
      value={{ productReturns, loading, error, setProductReturns, fetchProductReturns }}
    >
      {children}
    </ProductReturnContext.Provider>
  );
};

// Custom hook for using the context
export const useProductReturnContext = () => {
  const context = useContext(ProductReturnContext);
  if (!context) {
    throw new Error("useProductReturnContext must be used within a ProductReturnProvider");
  }
  return context;
};
