"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Replace } from "@/prisma/type";
import { api } from "@/lib/axios";
import { getReplacements } from "@/lib/data/replacements";
import { ReplaceCustom } from "../components/options";
import { getAllReplacements } from "@/lib/actions/replacement-actions";

// Define the context type
interface ReplaceContextType {
  replaces: ReplaceCustom[];
  loading: boolean;
  error: string;
  setReplaces: (replaces: ReplaceCustom[]) => void;
  fetchReplaces: () => Promise<void>;
}

// Create the context
const ReplaceContext = createContext<ReplaceContextType | undefined>(undefined);

// ReplaceProvider Component
export const ReplaceProvider = ({ children }: { children: ReactNode }) => {
  const [replaces, setReplaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReplaces = async () => {
    setLoading(true);
    try {
      // const { data } = await api.get("/product-returns");
      const replacements = await getAllReplacements();
      setReplaces(replacements?.data ?? []);
    } catch (err) {
      setError("Failed to load replaces. Please try again.");
      console.error("Error fetching replaces:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplaces();
  }, []);

  return (
    <ReplaceContext.Provider
      value={{ replaces, loading, error, setReplaces, fetchReplaces }}
    >
      {children}
    </ReplaceContext.Provider>
  );
};

// Custom hook for using the context
export const useReplaceContext = () => {
  const context = useContext(ReplaceContext);
  if (!context) {
    throw new Error("useReplaceContext must be used within a ReplaceProvider");
  }
  return context;
};
