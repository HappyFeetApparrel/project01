"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// import axios
import { api } from "@/lib/axios";

import { Supplier } from "@/prisma/type";

import { LineWave } from "react-loader-spinner";

interface SupplierSearchProps {
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function SupplierSearch({
  value,
  onChange,
  disabled,
}: SupplierSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/suppliers");
      setSuppliers(data.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filtered: Supplier[] = suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  useEffect(() => {
    const selectedSupplier = suppliers.find(
      (supplier) => supplier.supplier_id === value
    );
    if (selectedSupplier) {
      setSearchTerm(selectedSupplier.name);
    } else {
      setSearchTerm("");
    }
  }, [value, suppliers]);

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

  const handleSupplierClick = (supplierId: number, supplierName: string) => {
    onChange(supplierId);
    setSearchTerm(supplierName);
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
          placeholder="Search suppliers..."
          aria-label="Search suppliers"
          aria-expanded={isOpen}
          aria-controls="supplier-list"
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
          id="supplier-list"
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
          ) : filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier: Supplier, index: number) => (
              <button
                key={index}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                onClick={() =>
                  handleSupplierClick(supplier.supplier_id, supplier.name)
                }
                role="option"
                type="button"
              >
                {supplier.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No suppliers found</div>
          )}
        </div>
      )}
    </div>
  );
}
