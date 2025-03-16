"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAccessToken } from "../../redux/slices/authSlice";
import { setUser } from "../../redux/slices/userSlice";
import { signin, fetchCurrentUser } from "../api/auth/authApi";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignInPage({ isEmbedded = false }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Honeypot state
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Check honeypot field
    if (honeypot) {
      console.log("Bot detected!");
      setErrorMessage("Something went wrong. Please try again.");
      return;
    }

    try {
      const response = await signin(email, password);
      const token = response.access_token;

      dispatch(setAccessToken({ accessToken: token }));
      localStorage.setItem("authToken", token);

      const userData = await fetchCurrentUser(token);

      dispatch(
        setUser({
          id: userData.id,
          fname: userData.fname,
          lname: userData.lname,
          email: userData.email,
          role: userData.role,
        })
      );

      setSuccessMessage("Giriş Başarılı");
      router.push("/anasayfa");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("LOGIN_BAD_CREDENTIALS")) {
          setErrorMessage(
            "Girilen E-posta ve şifre bilgileri hatalı veya böyle bir hesap sistemde bulunmuyor."
          );
        } else {
          setErrorMessage("Bir hata oluştu. Tekrar Deneyiniz.");
        }
      } else {
        setErrorMessage("Bir hata oluştu. Tekrar Deneyiniz.");
      }
    }
  };

  return (
    <div
      className={`flex ${
        isEmbedded ? "h-auto" : "h-screen"
      } items-start justify-center bg-background pt-12`}
    >
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Hoşgeldiniz
        </h2>
        <p className="text-sm text-center text-gray-600 mt-2">Giriş Yapın</p>

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
              E-Posta Adresi
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-black mt-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-secondary"
              placeholder="E-postanızı girin..."
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
          <div className="flex justify-end">
            <Link
              href="/sifremi-unuttum"
              className="text-sm text-tertiary hover:underline"
            >
              Şifrenizi mi Unuttunuz?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 text-white bg-secondary rounded-lg font-medium hover:bg-tertiary focus:outline-none focus:ring-4 focus:ring-tertiary"
          >
            Giriş Yap
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Hesabınız yok mu?{" "}
          <Link
            href="/hesap-olustur"
            className="text-tertiary font-semibold hover:underline"
          >
            Hesap Oluştur
          </Link>
        </p>
      </div>
    </div>
  );
}
