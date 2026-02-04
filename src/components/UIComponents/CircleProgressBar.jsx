import React from 'react';

const CircularProgress = ({ progress = 25, size = 80 }) => {
  const stroke = 4;
  const radius = size / 2 - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const center = size / 2;
  const isComplete = progress >= 100;

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          stroke="#d1d5db"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={center}
          cy={center}
        />
        {/* Progress circle */}
        <circle
          stroke="#06b6d4"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={center}
          cy={center}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>

      {/* Content inside circle */}
      <div className="absolute inset-0 flex items-center justify-center cursor-default">
        {isComplete ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${size < 60 ? 'w-4 h-4' : 'w-6 h-6'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="#06b6d4"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <span
            className="font-bold text-[#9ca3af]"
            style={{ fontSize: size / 3.5 }}
          >
            {Math.round(progress)}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
