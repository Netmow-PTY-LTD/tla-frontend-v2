import React from 'react';

const Progress = ({ completion }) => {
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
      <div
        className="h-full bg-cyan-500 transition-all duration-300 ease-in-out"
        style={{ width: `${completion}%` }}
      ></div>
    </div>
  );
};

export default Progress;
