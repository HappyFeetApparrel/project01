"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// import axios
import { api } from "@/lib/axios";

import { Product } from "@/prisma/type";

import { LineWave } from "react-loader-spinner";

interface ProductSearchProps {
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function ProductSearch({
  value,
  onChange,
  disabled,
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered: Product[] = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    const selectedProduct = products.find(
      (product) => product.product_id === value
    );
    if (selectedProduct) {
      setSearchTerm(selectedProduct.name);
    } else {
      setSearchTerm("");
    }
  }, [value, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange(0); // Reset the form value when user types
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleProductClick = (productId: number, productName: string) => {
    onChange(productId);
    setSearchTerm(productName);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          ref={inputRef}
          placeholder="Search products..."
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="product-list"
          disabled={disabled ? true : false}
        />
        {!disabled && (
          <Search
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        )}
      </div>
      {isOpen && (
        <div
          id="product-list"
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {loading ? (
            <>
              <LineWave
                visible={true}
                height="100"
                width="100"
                color="#00a3ff"
                ariaLabel="line-wave-loading"
                wrapperStyle={{}}
                wrapperClass="justify-center h-[300px] items-center"
                firstLineColor=""
                middleLineColor=""
                lastLineColor=""
              />
            </>
          ) : error ? (
            <p>Error loading data: {error}</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product: Product, index: number) => (
              <button
                key={index}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                onClick={() =>
                  handleProductClick(product.product_id, product.name)
                }
                type="button"
              >
                {product.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No products found</div>
          )}
        </div>
      )}
    </div>
  );
}
