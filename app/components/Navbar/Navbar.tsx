// app/components/Navbar/Navbar.tsx

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearAccessToken } from "../../../redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { fetchCurrentUser } from "@/app/api/auth/authApi";
import { LeafAnimation } from "../../components/LeafAnimation/LeafAnimation";

import uskumenzadeLogo from "../../../public/images/uskumenzade-logo.svg";

interface NavbarProps {
  viewable?: boolean;
}

export const Navbar = ({ viewable = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const [isSuperUser, setIsSuperUser] = useState(false);
  const [showLeaves, setShowLeaves] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (accessToken) {
          const userData = await fetchCurrentUser(accessToken);
          setIsSuperUser(userData.is_superuser); // Update state with is_superuser
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsSuperUser(false);
      }
    };

    fetchUserData();
  }, [accessToken]); // Re-run if accessToken changes

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return payload.exp < currentTime;
    } catch (e) {
      console.error("Failed to parse token:", e);
      return true;
    }
  };

  const isTokenValid = accessToken && !isTokenExpired(accessToken);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    if (isOpenProfile) setIsOpenProfile(false); // Close profile if menu is opened
  };

  const toggleProfile = () => {
    setIsOpenProfile((prev) => !prev);
    if (isOpen) setIsOpen(false); // Close menu if profile is opened
  };

  // Logout function
  const handleLogout = () => {
    dispatch(clearAccessToken()); // Clear token from Redux
    localStorage.removeItem("authToken"); // Clear token from localStorage
    router.push("/giris"); // Redirect to sign-in page
  };

  return (
    <header
      className={`bg-white shadow-lg sticky top-0 z-50 ${
        !viewable ? "hidden" : ""
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <div className="flex items-center">
            <Image src={uskumenzadeLogo} alt="Logo" width={240} height={80} />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/urunler" className="text-gray-800 hover:text-tertiary">
            Ürünler
          </Link>
          <Link href="/blog" className="text-gray-800 hover:text-tertiary">
            Blog
          </Link>
          <Link
            href="/hakkimizda"
            className="text-gray-800 hover:text-tertiary"
          >
            Hakkımızda
          </Link>
          <Link href="/iletisim" className="text-gray-800 hover:text-tertiary">
            İletişim
          </Link>
          <div className="relative">
            <Link
              href="/sepet"
              className="bg-secondary hover:bg-tertiary text-xl text-white px-6 py-2 rounded-3xl relative overflow-hidden"
              onMouseEnter={() => setShowLeaves(true)}
              onMouseLeave={() => setShowLeaves(false)}
            >
              Sepet
              {showLeaves && <LeafAnimation />}
            </Link>
          </div>

          {isSuperUser && (
            <Link
              href="/admin"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Admin Paneli
            </Link>
          )}

          {/* Conditional Profile Dropdown */}
          <div className="relative">
            <div
              onMouseEnter={() => {
                setIsOpenProfile(true);
                if (hoverTimeout) clearTimeout(hoverTimeout);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setIsOpenProfile(false), 3000);
                setHoverTimeout(timeout);
              }}
              className=" relative text-gray-800 hover:text-tertiary focus:outline-none"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 20h16a8 8 0 10-16 0z"
                />
              </svg>
            </div>
            {isOpenProfile && (
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transition-opacity duration-500 ${
                  isOpenProfile ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onMouseEnter={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  setIsOpenProfile(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(
                    () => setIsOpenProfile(false),
                    3000
                  );
                  setHoverTimeout(timeout);
                }}
              >
                {isTokenValid ? (
                  <>
                    <Link
                      href="/profil"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsOpenProfile(false)}
                    >
                      Hesap Bilgilerim
                    </Link>
                    <Link
                      href="/siparislerim"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsOpenProfile(false)}
                    >
                      Siparişlerim
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpenProfile(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <Link
                    href="/giris"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Giriş Yap
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Icons Container */}
        <div className="flex items-center md:hidden space-x-4">
          <button
            className="text-gray-800 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Mobile Profile Dropdown */}
          <div className="relative">
            <button
              className="text-gray-800 hover:text-tertiary focus:outline-none"
              onClick={toggleProfile}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 20h16a8 8 0 10-16 0z"
                />
              </svg>
            </button>

            {isOpenProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                {isTokenValid ? (
                  <>
                    <Link
                      href="/profil"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsOpenProfile(false)}
                    >
                      Hesap Bilgilerim
                    </Link>
                    <Link
                      href="/siparislerim"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsOpenProfile(false)}
                    >
                      Siparişlerim
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpenProfile(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <div className="block px-4 py-2 text-gray-800">Giriş Yap</div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col items-center space-y-4 p-4">
            <Link
              href="/urunler"
              className="text-gray-800 hover:text-tertiary"
              onClick={toggleMenu}
            >
              Ürünler
            </Link>
            <Link
              href="/blog"
              className="text-gray-800 hover:text-tertiary"
              onClick={toggleMenu}
            >
              Bloglar
            </Link>
            <Link
              href="/hakkimizda"
              className="text-gray-800 hover:text-tertiary"
              onClick={toggleMenu}
            >
              Hakkımızda
            </Link>
            <Link
              href="/iletisim"
              className="text-gray-800 hover:text-tertiary"
              onClick={toggleMenu}
            >
              İletişim
            </Link>
            <Link
              href="/sepet"
              className="text-gray-800 hover:text-tertiary"
              onClick={toggleMenu}
            >
              Sepet
            </Link>
            {isSuperUser && (
              <Link
                href="/admin"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={toggleMenu}
              >
                Admin Paneli
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
