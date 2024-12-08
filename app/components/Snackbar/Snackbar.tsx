"use client";
import React, { useEffect } from "react";

interface SnackbarProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed z-50 px-4 py-2 rounded-md shadow-lg text-white 
        ${type === "success" ? "bg-green-500" : "bg-red-500"} 
        sm:top-4 sm:right-4 sm:left-auto sm:transform-none
        top-4 left-1/2 transform -translate-x-1/2`}
    >
      {message}
    </div>
  );
};
