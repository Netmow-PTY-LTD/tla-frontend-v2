'use client';

import React from 'react';
import clsx from 'clsx';

const TagButton = ({
  text,
  bgColor = 'transparent',
  icon,
  onClick,
  onChange,
  className,
  fontSize,
  textColor,
  rounded,
}) => {
  return (
    <button
      className={clsx(
        !className &&
          `${fontSize ? fontSize : 'text-[12px]'} ${
            textColor ? textColor : 'text-[black]'
          } px-3 py-1.5 ${
            rounded ? rounded : 'rounded-[30px]'
          } flex items-center gap-2 transition-all duration-200 active:scale-95 hover:bg-gray-950 capitalize`,
        className
      )}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
      onChange={onChange}
      role="button"
    >
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};

export default TagButton;
