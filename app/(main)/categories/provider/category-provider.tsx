"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Category } from "@/prisma/type";
import { api } from "@/lib/axios";

// Define the context type
interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string;
  setCategories: (categories: Category[]) => void;
  fetchCategories: () => Promise<void>;
}

// Create the context
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

// CategoryProvider Component
export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, loading, error, setCategories, fetchCategories }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook for using the context
export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};
