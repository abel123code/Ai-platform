// components/ui/Badge.js

import React from 'react';

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-700 text-white',
    secondary: 'bg-blue-600 text-white',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
