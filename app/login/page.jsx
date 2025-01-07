'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/component/ui/Button';
import { Input } from '@/component/ui/Input';
import { Google } from '@mui/icons-material';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      router.replace('/home');
    }
  }, [sessionStatus, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (activeTab === 'signin') {
      // Handle sign-in
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Sign in successful! Redirecting...' });
        router.push('/home');
      }
    } else if (activeTab === 'verify') {
      // Handle resend verification email
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
            text: data.message || 'Verification email sent successfully. Please check your inbox.',
          });
        } else {
          setMessage({
            type: 'error',
            text: data.message || 'Failed to send verification email. Please try again.',
          });
        }
      } catch (error) {
        console.error('Resend Verification Error:', error);
        setMessage({
          type: 'error',
          text: 'An unexpected error occurred. Please try again.',
        });
      }
    } else if (activeTab === 'reset') {
      // Handle password reset
      try {
        const res = await fetch('/api/forget-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setMessage({
            type: 'success',
            text: data.message || 'Password reset email sent successfully. Please check your inbox.',
          });
        } else {
          setMessage({
            type: 'error',
            text: data.message || 'Failed to send password reset email. Please try again.',
          });
        }
      } catch (error) {
        console.error('Password Reset Error:', error);
        setMessage({
          type: 'error',
          text: 'An unexpected error occurred. Please try again.',
        });
      }
    }

    setLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage({ type: '', text: '' });
    setEmail('');
    setPassword('');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signIn('google');
    if (result?.error) {
      console.error('Sign in error:', result.error);
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Sign in successful! Redirecting...' });
      router.push('/home');
    }
    setLoading(false);
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

        {/* Display Messages */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-md text-sm ${
              message.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className='relative'>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className="pl-10 w-full pr-10 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <div className='relative'>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  autoComplete="current-password"
                  className="pl-10 w-full pr-10 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="my-6 flex items-center justify-center">
              <span className="w-full border-t border-gray-300"></span>
              <span className="px-4 text-gray-500">OR</span>
              <span className="w-full border-t border-gray-300"></span>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-400 focus:outline-none flex items-center justify-center gap-2"
            >
              <Google />
              {loading ? 'Signing In...' : 'Sign in with Google'}
            </Button>

            <p className="mt-4 text-center text-white">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        )}

        {activeTab === 'verify' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className='relative'>
                <Input
                  type="email"
                  id="verify-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder='Email'
                  className="pl-10 w-full pr-10 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
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
        )}

        {activeTab === 'reset' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className='relative'>
                <Input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder='Email'
                  className="pl-10 w-full pr-10 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
