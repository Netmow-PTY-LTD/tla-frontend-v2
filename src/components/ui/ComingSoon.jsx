'use client';

import { AlertTriangle } from 'lucide-react';

const ComingSoon = ({
  title = 'Coming Soon!',
  message = 'This feature is currently under development and will be available soon.',
  icon = <AlertTriangle className="h-10 w-10 text-yellow-500" />,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center border-2 border-dashed border-yellow-400 bg-yellow-50 p-6 rounded-2xl shadow-md ${className}`}
    >
      <div className="mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-yellow-700">{title}</h2>
      <p className="text-sm text-yellow-600 mt-2 max-w-md">{message}</p>
    </div>
  );
};

export default ComingSoon;
