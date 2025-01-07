'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/component/ui/Button';
import { Input } from '@/component/ui/Input';
import { Google } from '@mui/icons-material';
import { Mail, Lock } from 'lucide-react';

export default function SignInForm({ setMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  // Handle sign in with credentials
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setMessage({ type: '', text: '' });

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

    setLoginLoading(false);
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setMessage({ type: '', text: '' });

    const result = await signIn('google');
    if (result?.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Sign in successful! Redirecting...' });
      router.push('/home');
    }

    setGoogleLoading(false);
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {/* Email Field */}
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

      {/* Password Field */}
      <div className="relative">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="pl-10 w-full pr-10 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
        />
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Credentials Sign In Button */}
      <Button
        type="submit"
        disabled={loginLoading}
        className={`w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none ${
          loginLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loginLoading ? 'Signing In...' : 'Sign In'}
      </Button>

      {/* OR separator */}
      <div className="my-6 flex items-center justify-center">
        <span className="w-full border-t border-gray-300"></span>
        <span className="px-4 text-gray-500">OR</span>
        <span className="w-full border-t border-gray-300"></span>
      </div>

      {/* Google Sign In Button */}
      <Button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-400 focus:outline-none flex items-center justify-center gap-2"
      >
        <Google />
        {googleLoading ? 'Signing In with Google...' : 'Sign in with Google'}
      </Button>

      {/* Register Link */}
      <p className="mt-4 text-center text-white">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
