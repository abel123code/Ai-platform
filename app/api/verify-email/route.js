import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/user';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect('/verification-failed');
    }

    await connectToDB();

    // Find the user with the matching token and token expiry
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
        return NextResponse.redirect('/verification-failed');
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.redirect('/verification-success');
  } catch (error) {
    console.error('Email Verification Error:', error);
    return NextResponse.redirect('/verification-failed');
  }
}
