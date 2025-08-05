"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export const WhatsAppButton = () => {
  const [showGoToTopButton, setShowGoToTopButton] = useState(false);

  // Show or hide the Go to Top button when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowGoToTopButton(true);
      } else {
        setShowGoToTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    // You can replace this with the link to open WhatsApp or a specific chat
    window.open("https://wa.me/905519888205", "_blank");
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`fixed right-6 transition-all duration-300 z-50 ${
          showGoToTopButton ? "bottom-20" : "bottom-6"
        } bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600`}
      >
        <FaWhatsapp size={30} />
      </button>
    </>
  );
};
