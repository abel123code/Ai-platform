'use client';

import clsx from 'clsx';

export const Button = ({ variant = 'default', className, ...props }) => {
  const baseStyles = 'py-2 px-4 rounded font-semibold focus:outline-none transition-colors';
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    ghost: 'text-gray-100 hover:text-blue-500',
  };

  return (
    <button className={clsx(baseStyles, variants[variant], className)} {...props}>
      {props.children}
    </button>
  );
};
