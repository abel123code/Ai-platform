'use client';

export const Input = ({ className, ...props }) => {
  const baseStyles = 'py-2 px-4 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500';
  return <input className={`${baseStyles} ${className}`} {...props} />;
};
