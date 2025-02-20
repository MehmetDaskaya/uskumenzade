"use client";

import { cn } from "@/util/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCardsClient = ({
  reviews,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  reviews: {
    name: string;
    rating: number;
    comment: string;
    productImage: string;
    userImage: string;
    product: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  const addAnimation = () => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      });

      setAnimationProperties();
      setStart(true);
    }
  };

  const setAnimationProperties = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
    containerRef.current.style.setProperty(
      "--animation-duration",
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s"
    );
  };

  return (
    <section id="infinite-moving-cards" className="py-16 bg-secondary">
      <div
        ref={containerRef}
        className={cn(
          "relative z-20 max-w-7xl mx-auto overflow-hidden",
          "mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
          className
        )}
      >
        <h2 className="text-3xl text-white font-bold text-center mb-12">
          Müşteri Yorumları
        </h2>
        <ul
          ref={scrollerRef}
          className={cn(
            "flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap",
            start && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
        >
          {reviews.map((review) => (
            <li
              key={review.name}
              className="w-[380px] max-w-full relative rounded-2xl shadow-lg bg-white px-6 py-6 flex flex-col items-center space-y-4"
            >
              {/* User Image */}
              <img
                src={review.userImage}
                alt={review.name}
                className="w-14 h-14 rounded-full border-2 border-gray-300"
              />
              {/* User Name */}
              <div className="mt-2 text-sm text-gray-500">{review.name}</div>

              {/* Review Text */}
              <blockquote className="text-center text-gray-700 text-sm min-h-[80px]">
                {review.comment}
              </blockquote>

              {/* Rating */}
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < review.rating ? "text-primary" : "text-gray-300"
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Product Name */}
              <span className="text-gray-900 font-semibold">
                {review.product}
              </span>

              {/* Product Image */}
              <img
                src={review.productImage}
                alt={review.product}
                className="w-full h-28 object-cover rounded-lg"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
