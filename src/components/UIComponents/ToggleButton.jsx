'use client';
import React, { useState } from 'react';
import clsx from 'clsx';

const sizes = {
  sm: { button: 'w-8 h-5', handle: 'w-3 h-3', translate: 'translate-x-4' },
  lg: { button: 'w-12 h-6', handle: 'w-5 h-5', translate: 'translate-x-6' },
  xl: { button: 'w-16 h-8', handle: 'w-7 h-7', translate: 'translate-x-8' },
};

const ToggleButton = ({
  isOn: initialState = false,
  onToggle,
  onClick,
  size = 'lg',
  className = '',
  activeColor = 'bg-[#0B1C2D]',
  inactiveColor = 'bg-slate-300',
  activeHandleColor = 'bg-[#00C3C0]',
  inactiveHandleColor = 'bg-gray-500',
}) => {
  const [isOn, setIsOn] = useState(initialState);
  const { button, handle, translate } = sizes[size] || sizes.lg;

  const handleClick = (event) => {
    setIsOn(!isOn);
    if (onToggle) onToggle(!isOn);
    if (onClick) onClick(event);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'flex items-center rounded-full p-1 transition-all duration-300',
        isOn ? activeColor : inactiveColor,
        button,
        className
      )}
    >
      <div
        className={clsx(
          'rounded-full shadow-md transform transition-all duration-300',
          handle,
          isOn ? translate : 'translate-x-0',
          isOn ? activeHandleColor : inactiveHandleColor
        )}
      />
    </button>
  );
};

export default ToggleButton;
