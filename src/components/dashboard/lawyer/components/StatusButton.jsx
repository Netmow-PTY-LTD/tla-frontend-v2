'use client';

import React from 'react';

const statusColors = {
  pending: 'bg-[#FF8602]',
  hired: 'bg-[#00C3C0]',
  rejected: 'bg-red-500',
  default: 'bg-gray-400',
};

const StatusButton = ({ status = 'pending', onClick, fontSize }) => {
  return (
    <button
      className={`flex items-center ${
        fontSize ? fontSize : 'text-[18px]'
      } font-medium px-4 py-1.5 rounded-lg hover:bg-white hover:text-black `}
      onClick={onClick}
    >
      <span
        className={`w-3 h-3 rounded-full ${
          statusColors[status] || statusColors.default
        } mr-2`}
      ></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  );
};

export default StatusButton;
