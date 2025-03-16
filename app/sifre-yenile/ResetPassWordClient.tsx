"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "../api/auth/authApi";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Snackbar } from "../components/"; // Import Snackbar component

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      showSnackbar("Geçersiz veya eksik şifre sıfırlama bağlantısı.", "error");
    }
  }, [searchParams]);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = searchParams.get("token");
    if (!token) {
      showSnackbar("Geçersiz veya eksik şifre sıfırlama bağlantısı.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar("Şifreler uyuşmuyor, lütfen tekrar deneyin.", "error");
      return;
    }

    try {
      await resetPassword(token, password);

      showSnackbar("Şifreniz başarıyla sıfırlandı.", "success");
      setTimeout(() => {
        window.location.href = "/giris";
      }, 3000);

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      showSnackbar(
        "Şifre sıfırlama sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        "error"
      );
      console.error("Şifre sıfırlama hatası:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Şifreyi Sıfırla
        </h2>
        <p className="text-sm text-center text-gray-600 mt-2">
          Yeni şifrenizi girerek sıfırlayın
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <label htmlFor="password" className="text-sm text-gray-700">
              Yeni Şifre
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-tertiary"
              placeholder="Yeni şifrenizi girin"
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
              Yeni Şifreyi Onayla
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-tertiary"
              placeholder="Yeni şifrenizi tekrar girin"
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

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}
