'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';
import LoadingSpinner from '@/component/LoadingSpinner';

export default function ResetPassword({params}) {
  const router = useRouter();
  const [verified, setVerified] = useState(false); //state to check if process of validation of token has been completed
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('')
  const { data: session, status: sessionStatus } = useSession()

  useEffect(() => {
    //API to check if token is valid and not expired
    const verifyToken = async () => {
      try {
        const res = await fetch('/api/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: params.token }),
        });

        const data = await res.json();

        if (res.status === 400) {
          setError('Invalid Token or has expired')
          setVerified(true)
        } 
        if (res.status === 200) {
          setError("")
          setVerified(true)
          setUser(data)
        }
      } catch (err) {
          setError('Unexpected error occurred');
          console.error('Forget Password Error:', err);
      } finally {
          setLoading(false);
      }
    }

    verifyToken()
  }, [params.token])

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      router.replace('/home')
    }
  }, [sessionStatus, router])

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); 

    try {
      const res = await fetch('/api/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              password,
              email: user?.email
          }),
      });

      const data = await res.json(); // This will now correctly parse the JSON response

      if (res.status === 400 || res.status === 404) { // Handle both 400 and 404 errors
          setError(data.message || 'Something went wrong, try again');
      } else if (res.status === 200) {
          setError("");
          router.push('/login');
      } else {
          // Handle other unexpected status codes
          setError(data.error || 'Unexpected response from the server');
      }
    } catch (err) {
        setError('Unexpected error occurred');
        console.error('Reset Password Error:', err);
    } finally {
        setLoading(false);
    }
};
  if (sessionStatus === "loading" || !verified) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 py-6">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Reset Password</h1>
      
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <label htmlFor="password" className="block text-white font-medium mb-1">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button 
            type="submit" 
            disabled={error.length > 0} 
            className={`w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-4 text-center text-white">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
                Login
            </a>
        </p>
    </div>
  </div>
  );
}
