// components/ui/Card.js

import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => {
  return (
    <div className={`p-4 border-b border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }) => {
  return (
    <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
  );
};

export const CardDescription = ({ children, className }) => {
  return (
    <p className={`text-sm text-gray-400 ${className}`}>{children}</p>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export function CardFooter({ children }) {
  return <div className="mt-4">{children}</div>;
}
