'use client';

import { useState } from 'react';

export default function ToggleSwitch({ enabled = false, onToggle }) {
  const [isOn, setIsOn] = useState(enabled);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle?.(newState);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
        isOn ? 'bg-[#00C3C0]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          isOn ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
