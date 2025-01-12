"use client";

import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SuccessPopupProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function SuccessPopup({
  message,
  duration = 3000,
  onClose,
}: SuccessPopupProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg",
        "flex items-center space-x-2 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <CheckCircle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
}
