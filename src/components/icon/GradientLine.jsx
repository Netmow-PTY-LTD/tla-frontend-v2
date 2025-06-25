import React from 'react';

export default function GradientLine() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1"
      height="410"
      viewBox="0 0 1 410"
      fill="none"
    >
      <path
        d="M0.49707 0.539062V409.318"
        stroke="url(#paint0_linear_952_5428)"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_952_5428"
          x1="0.99707"
          y1="0.539062"
          x2="0.99707"
          y2="409.318"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00CCB3" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#009E8B" />
          <stop offset="1" stopColor="#00CCB3" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
