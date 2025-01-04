import React from 'react';

const CancelPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Payment Cancelled</h1>
      <p className="mt-4">You have not been charged. Please try again.</p>
    </div>
  );
};

export default CancelPage;
