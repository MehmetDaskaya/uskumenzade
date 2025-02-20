"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // To read query parameters
import { resetPassword } from "../api/auth/authApi"; // Adjust the path if necessary
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Icons for password visibility toggle

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Ensure token is present in query params
    const token = searchParams.get("token");
    if (!token) {
      setErrorMessage("Invalid or missing reset token.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const token = searchParams.get("token");
    if (!token) {
      setErrorMessage("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Call resetPassword API
      await resetPassword(token, password);

      setSuccessMessage("Your password has been successfully reset.");
      setPassword(""); // Clear the password input
      setConfirmPassword(""); // Clear the confirm password input
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Reset Password
        </h2>
        <p className="text-sm text-center text-gray-600 mt-2">
          Enter your new password to reset it
        </p>

        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <label htmlFor="password" className="text-sm text-gray-700">
              New Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-tertiary"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className="absolute right-3 top-7 inset-y-0 flex items-center text-gray-500 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="text-sm text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-tertiary"
              placeholder="Re-enter your new password"
            />
            <button
              type="button"
              className="absolute right-3 top-7 inset-y-0 flex items-center text-gray-500 focus:outline-none"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-secondary rounded-md hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
          >
            Şifreyi Sıfırla
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/giris" className="text-sm text-tertiary hover:underline">
            Giriş Sayfasına Geri Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
