'use client';

import { useState } from 'react';
import { Button } from '@/component/ui/Button';
import { Input } from '@/component/ui/Input';
import { Mail } from 'lucide-react';

export default function VerifyForm({ setMessage }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/resend-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          type: 'success',
          text: data.message || 'Verification email sent successfully!',
        });
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to send verification email.',
        });
      }
    } catch (error) {
      console.error('Resend Verification Error:', error);
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred.',
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div className="relative">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="pl-10 w-full pr-10 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
        />
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Sending...' : 'Send Verification Email'}
      </Button>
    </form>
  );
}
