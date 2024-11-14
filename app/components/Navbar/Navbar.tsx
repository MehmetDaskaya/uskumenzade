"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearAccessToken } from "../../../redux/slices/authSlice"; // Import action to clear token
import { RootState } from "@/redux/store";

import uskumenzadeLogo from "../../../public/images/uskumenzade-logo.png";

interface NavbarProps {
  viewable?: boolean;
}

export const Navbar = ({ viewable = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    router.push("/signin"); // Redirect to sign-in page
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <header
      className={`bg-white shadow-lg sticky top-0 z-50 ${
        !viewable ? "hidden" : ""
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <div className="flex items-center">
            <Image src={uskumenzadeLogo} alt="Logo" width={120} height={50} />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/urunler" className="text-gray-800 hover:text-yellow-600">
            Ürünler
          </Link>
          <Link href="/blog" className="text-gray-800 hover:text-yellow-600">
            Blog
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-yellow-600">
            Hakkımızda
          </Link>
          <Link
            href="/sepet"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Sepet
          </Link>

          {/* Conditional Profile Dropdown */}
          <div className="relative">
            <button
              className="text-gray-800 hover:text-yellow-600 focus:outline-none"
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
                {accessToken ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Login
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
              className="text-gray-800 hover:text-yellow-600 focus:outline-none"
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
                {accessToken ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={toggleProfile}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={toggleProfile}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={toggleProfile}
                  >
                    Login
                  </Link>
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
              className="text-gray-800 hover:text-yellow-600"
              onClick={toggleMenu}
            >
              Ürünler
            </Link>
            <Link
              href="/blog"
              className="text-gray-800 hover:text-yellow-600"
              onClick={toggleMenu}
            >
              Bloglar
            </Link>
            <Link
              href="/about"
              className="text-gray-800 hover:text-yellow-600"
              onClick={toggleMenu}
            >
              Hakkımızda
            </Link>
            <Link
              href="/sepet"
              className="text-gray-800 hover:text-yellow-600"
              onClick={toggleMenu}
            >
              Sepet
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
