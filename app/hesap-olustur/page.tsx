"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "../api/auth/authApi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import logo from "../../public/images/uskumenzade-spinner.png";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Honeypot field state
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setErrorMessage(""); // Clear previous error messages

    // If honeypot field is filled, treat as spam
    if (honeypot) {
      console.log("Bot detected!");
      return;
    }

    // Password validation
    if (password.trim() === "" || confirmPassword.trim() === "") {
      setErrorMessage("Şifre alanları boş bırakılamaz!");
      return; // Prevent submission
    }

    if (password !== confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor! Lütfen tekrar deneyin.");
      return; // Prevent submission
    }

    try {
      setIsLoading(true); // Show loading spinner

      // Call the signup API
      await signup(email, password, fname, lname);

      // Simulate delay and redirect to login
      setTimeout(() => {
        router.push("/giris");
      }, 2000);
    } catch (error) {
      setIsLoading(false); // Stop loading spinner

      // Use type assertion or check for the structure of the error
      if (
        error instanceof Error &&
        (error as { detail?: string }).detail === "REGISTER_USER_ALREADY_EXISTS"
      ) {
        setErrorMessage(
          "Bu e-posta adresi ile daha önce bir hesap oluşturulmuş."
        );
      } else if (error instanceof Error) {
        setErrorMessage("Hesap oluşturulurken bir hata oluştu.");
      } else {
        console.error("Unknown error:", error);
        setErrorMessage("Bilinmeyen bir hata oluştu.");
      }
    }
  };

  return (
    <div className="flex h-screen items-start justify-center bg-background pt-8">
      {isLoading ? (
        <div className="-mt-20">
          <LoadingSpinner
            logo={logo}
            aboveText="Hesap başarıyla oluşturuldu, giriş sayfasına yönlendiriliyorsunuz."
          />
        </div>
      ) : (
        <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Hesap Oluştur
          </h2>
          <p className="text-sm text-center text-gray-600 mt-2">
            Üskümenzade&apos;de hesap oluşturun ve fırsatlı fiyatlardan
            faydalanın.
          </p>
          {errorMessage && (
            <p className="text-red-500 text-center mt-4 font-medium">
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
            {/* Honeypot field */}
            <div className="hidden">
              <label htmlFor="honeypot">Honeypot</label>
              <input
                id="honeypot"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1} // Prevents tabbing to the field
                autoComplete="off"
              />
            </div>

            <div className="flex flex-row justify-center items-center">
              <div className="mr-1">
                <label
                  htmlFor="fname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ad
                </label>
                <input
                  id="fname"
                  type="text"
                  required
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="w-full p-3 text-black mt-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-secondary"
                  placeholder="Adınızı girin..."
                />
              </div>
              <div className="ml-1">
                <label
                  htmlFor="lname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Soyad
                </label>
                <input
                  id="lname"
                  type="text"
                  required
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="w-full p-3 text-black mt-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-secondary"
                  placeholder="Soyadınızı girin..."
                />
              </div>
            </div>

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
                className="w-full p-3 text-black mt-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-secondary"
                placeholder="E-posta adresinizi girin..."
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 text-black mt-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-secondary"
                  placeholder="Şifrenizi girin..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Şifreyi Tekrarla
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 text-black mt-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-secondary"
                  placeholder="Şifrenizi tekrardan girin..."
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 text-white bg-secondary rounded-lg font-medium hover:bg-tertiary focus:outline-none focus:ring-4 focus:ring-tertiary"
            >
              Hesap Oluştur
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            Zaten bir hesabınız var mı?{" "}
            <Link
              href="/giris"
              className="text-tertiary font-semibold hover:underline"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
