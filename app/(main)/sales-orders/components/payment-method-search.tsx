"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// import axios
import { api } from "@/lib/axios";

import { PaymentMethod } from "@/prisma/type";

import { LineWave } from "react-loader-spinner";

interface PaymentMethodSearchProps {
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function PaymentMethodSearch({
  value,
  onChange,
  disabled,
}: PaymentMethodSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState<
    PaymentMethod[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/payment-methods");
      setPaymentMethods(data.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    const filtered: PaymentMethod[] = paymentMethods.filter((paymentMethod) =>
      paymentMethod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPaymentMethods(filtered);
  }, [searchTerm, paymentMethods]);

  useEffect(() => {
    const selectedPaymentMethod = paymentMethods.find(
      (paymentMethod) => paymentMethod.payment_method_id === value
    );
    if (selectedPaymentMethod) {
      setSearchTerm(selectedPaymentMethod.name);
    } else {
      setSearchTerm("");
    }
  }, [value, paymentMethods]);

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

  const handlePaymentMethodClick = (
    paymentMethodId: number,
    paymentMethodName: string
  ) => {
    onChange(paymentMethodId);
    setSearchTerm(paymentMethodName);
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
          placeholder="Search paymentMethods..."
          aria-label="Search paymentMethods"
          aria-expanded={isOpen}
          aria-controls="paymentMethod-list"
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
          id="paymentMethod-list"
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
          ) : filteredPaymentMethods.length > 0 ? (
            filteredPaymentMethods.map(
              (paymentMethod: PaymentMethod, index: number) => (
                <button
                  key={index}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                  onClick={() =>
                    handlePaymentMethodClick(
                      paymentMethod.payment_method_id,
                      paymentMethod.name
                    )
                  }
                  role="option"
                >
                  {paymentMethod.name}
                </button>
              )
            )
          ) : (
            <div className="px-4 py-2 text-gray-500">
              No paymentMethods found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
