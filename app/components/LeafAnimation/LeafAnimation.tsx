import React from "react";

export const LeafAnimation = () => {
  const leaves = ["🍃", "🌿", "🌿"]; // Different leaf emojis for variety
  const rotations = [-45, -20, 10, 30, 45]; // Diverse rotation angles

  return (
    <div className="absolute z-50 left-1/2 bottom-full flex flex-col gap-1">
      {leaves.map((leaf, index) => {
        const size = `${Math.random() * 15 + 20}px`; // Random size (20px - 35px)
        const leftOffset = `${Math.random() * 60 - 30}px`; // More spread out (-30px to +30px)
        const startRotation = rotations[index % rotations.length]; // Ensure different starting rotations
        const animationDelay = `${Math.random() * 0.5}s`; // Staggered animation

        return (
          <span
            key={index}
            className="absolute animate-falling-leaf"
            style={{
              left: leftOffset,
              fontSize: size,
              transform: `rotate(${startRotation}deg)`,
              animationDelay: animationDelay,
            }}
          >
            {leaf}
          </span>
        );
      })}
    </div>
  );
};
