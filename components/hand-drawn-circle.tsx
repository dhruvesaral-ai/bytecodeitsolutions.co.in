import React from "react";

interface HandDrawnCircleProps {
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export const HandDrawnCircle: React.FC<HandDrawnCircleProps> = ({
  className = "",
  color = "#F58216",
  strokeWidth = 3,
}) => {
  return (
    <svg
      className={`pointer-events-none absolute -inset-x-3 sm:-inset-x-4 -inset-y-1.5 sm:-inset-y-2 w-[calc(100%+1.5rem)] sm:w-[calc(100%+2rem)] h-[calc(100%+0.75rem)] sm:h-[calc(100%+1rem)] ${className}`}
      viewBox="0 0 260 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Outer loop that sweeps over the top, down the right, and across the bottom */}
      <path
        d="M 68 28 C 95 16 160 12 214 16 C 248 19 256 30 254 44 C 251 60 230 73 186 78 C 132 84 62 82 28 68 C 12 61 8 46 20 34 C 32 23 60 20 96 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ vectorEffect: "non-scaling-stroke" }}
      />
      {/* Inner loop that starts inside top-left, curves around bottom and right */}
      <path
        d="M 112 27 C 65 30 42 40 38 52 C 34 66 62 75 118 76 C 176 77 242 70 252 50 C 260 34 232 22 178 18 C 132 15 78 20 45 32"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ vectorEffect: "non-scaling-stroke" }}
      />
      {/* Sketched left crescent flourish matching the reference doodle */}
      <path
        d="M 38 36 C 20 44 14 56 18 68 C 21 74 27 78 35 80"
        stroke={color}
        strokeWidth={Math.max(1.8, strokeWidth * 0.75)}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ vectorEffect: "non-scaling-stroke" }}
      />
    </svg>
  );
};

export default HandDrawnCircle;
