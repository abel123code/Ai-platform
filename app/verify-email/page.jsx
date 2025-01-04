import { connectToDB } from '@/lib/mongodb';
import User from '@/models/user';
import { XCircle, RefreshCw, CheckCircle, Home } from "lucide-react"
import { Button } from "@/component/ui/Button"; 
import Link from 'next/link';

export default async function VerifyEmailPage({ searchParams }) {
  const token = searchParams.token;
  let verificationResult = null;

  if (!token) {
    verificationResult = 'invalid';
  } else {
    try {
      await connectToDB();

      const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        verificationResult = 'invalid';
      } else {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();
        verificationResult = 'success';
      }
    } catch (error) {
      console.error('Email Verification Error:', error);
      verificationResult = 'error';
    }
  }

  // Render the UI based on verificationResult
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      {verificationResult === 'success' && (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
          <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-2xl">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-6 text-3xl font-extrabold">Verification Successful!</h2>
              <p className="mt-2 text-sm text-gray-400">
                Your account has been successfully verified. You can now access all features of our platform.
              </p>
            </div>
            <div className="mt-8">
                <Link href="/login" passHref>
                    <Button className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <Home className="mr-2 h-5 w-5" />
                        Go to Login
                    </Button>
                </Link>
            </div>
          </div>
        </div>
      )}
      {verificationResult === 'invalid' && (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
          <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-2xl">
            <div className="text-center">
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-6 text-3xl font-extrabold">Verification Failed</h2>
              <p className="mt-2 text-sm text-gray-400">
                We're sorry, but we couldn't verify your account. This could be due to an expired or invalid verification link.
              </p>
            </div>
            <div className="mt-8">
                <Link href='/login' passHref>
                    <Button className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Retry Verification
                    </Button>
                </Link>
            </div>
            <p className="mt-2 text-xs text-center text-gray-500">
              If you continue to experience issues, please contact our support team for assistance.
            </p>
          </div>
        </div>
      )}
      {verificationResult === 'error' && (
        <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-2xl text-center">
          <h1 className="text-3xl font-extrabold mb-4">An Error Occurred</h1>
          <p className="mb-6">We encountered an error while verifying your email. Please try again later.</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
          >
            Go to Home
          </a>
        </div>
      )}
    </div>
  );
}
