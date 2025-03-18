import React from 'react';

const TagButton = ({ text, bgColor, icon }) => {
  return (
    <button
      className="text-sm px-3 py-1 rounded-[29px] flex items-center gap-2"
      style={{ backgroundColor: bgColor }}
    >
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};

export default TagButton;
