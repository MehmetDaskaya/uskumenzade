"use client";

import React, { useEffect } from "react";

interface SnackbarProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number; // Optional: default to 3000ms
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration); // Auto-dismiss after `duration`

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose, duration]);

  return (
    <div
      className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white shadow-md z-50 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};
