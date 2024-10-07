"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import uskumenzadeLogo from "../../../public/images/uskumenzade-logo.png";

interface NavbarProps {
  viewable?: boolean;
}

export const Navbar = ({ viewable = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
        {/* Logo Section */}
        <Link href="/">
          <div className="flex items-center">
            <Image src={uskumenzadeLogo} alt="Logo" width={120} height={50} />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            href="/products"
            className="text-gray-800 hover:text-yellow-600"
          >
            Ürünler
          </Link>
          <Link href="/blogs" className="text-gray-800 hover:text-yellow-600">
            Blog
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-yellow-600">
            Hakkımızda
          </Link>
          <Link
            href="/cart"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Sepet
          </Link>
        </div>

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
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
            ></path>
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col items-center space-y-4 p-4">
            <Link
              href="/products"
              className="text-gray-800 hover:text-yellow-600"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              href="/blogs"
              className="text-gray-800 hover:text-yellow-600"
              onClick={toggleMenu}
            >
              Blogs
            </Link>
            <Link
              href="/about"
              className="text-gray-800 hover:text-yellow-600"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              href="/cart"
              className="text-gray-800 hover:text-yellow-600"
              onClick={toggleMenu}
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
