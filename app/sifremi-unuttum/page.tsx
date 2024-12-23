"use client";

import { useState } from "react";
import Link from "next/link";

import { requestPasswordReset } from "../api/auth/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Request password reset
      await requestPasswordReset(email);

      setSuccessMessage(
        "Şifre sıfırlama bağlantısı belirttiğiniz e-posta adresinize gönderildi. E-postalarınızı kontrol ediniz."
      );
      setEmail("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
      }
    }
  };

  return (
    <div className="flex h-screen items-start justify-center bg-gradient-to-br from-yellow-50 to-gray-100 pt-8">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Şifre Sıfırla
        </h2>
        <p className="text-sm text-center text-gray-600 mt-2">
          Şifrenizi sıfırlamak için e-postanızı girin.
        </p>

        {errorMessage && (
          <p className="text-red-500 text-center mt-4 font-medium">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center mt-4 font-medium">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 text-black bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="E-posta adresinizi girin..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 text-white bg-yellow-500 rounded-lg font-medium hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            Sıfırlama Linki Gönder
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/giris"
            className="text-sm text-yellow-500 font-semibold hover:underline"
          >
            Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
