'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the tab components
const SignInForm = dynamic(() => import('./login/SignInForm'), {
  loading: () => <p className="text-white flex justify-center">Loading Sign In...</p>,
});
const VerifyForm = dynamic(() => import('./login/VerifyForm'), {
  loading: () => <p className="text-white flex justify-center">Loading Verification...</p>,
});
const ResetForm = dynamic(() => import('./login/ResetForm'), {
  loading: () => <p className="text-white flex justify-center">Loading Reset...</p>,
});

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState('signin');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 py-6">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white text-center">Welcome Back</h1>
        </div>
        {/* Tab Navigation */}
        <div className="flex justify-around mb-6">
          <button
            className={`px-4 py-2 focus:outline-none ${
              activeTab === 'signin' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-white'
            }`}
            onClick={() => handleTabChange('signin')}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 focus:outline-none ${
              activeTab === 'verify' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-white'
            }`}
            onClick={() => handleTabChange('verify')}
          >
            Verify Email
          </button>
          <button
            className={`px-4 py-2 focus:outline-none ${
              activeTab === 'reset' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-white'
            }`}
            onClick={() => handleTabChange('reset')}
          >
            Reset Password
          </button>
        </div>

        {/* Display any message */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-md text-sm ${
              message.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Render the correct form based on active tab */}
        {activeTab === 'signin' && (
          <SignInForm setMessage={setMessage} setLoading={setLoading} />
        )}
        {activeTab === 'verify' && (
          <VerifyForm setMessage={setMessage} setLoading={setLoading} />
        )}
        {activeTab === 'reset' && (
          <ResetForm setMessage={setMessage} setLoading={setLoading} />
        )}
      </div>
    </div>
  );
}
