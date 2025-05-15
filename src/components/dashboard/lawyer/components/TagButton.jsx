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
}) => {
  return (
    <button
      className={clsx(
        !className &&
          'text-sm px-3 py-1 rounded-[29px] flex items-center gap-2 transition-all duration-200 active:scale-95',
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
