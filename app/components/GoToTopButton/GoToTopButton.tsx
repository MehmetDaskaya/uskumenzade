"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export const GoToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-tertiary text-white p-3 rounded-full shadow-lg hover:bg-tertiary transition duration-300 z-50"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
};
