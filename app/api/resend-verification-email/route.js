import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/user'; // Ensure correct case
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal that the email doesn't exist
      return NextResponse.json(
        { success: true, message: 'Verification email has been sent if the email exists' }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Email is already verified. Please log in.' },
        { status: 400 }
      );
    }

    // Implement rate limiting per user
    // Check if the user has requested too many times or recently
    if (user.lastVerificationRequest && Date.now() - user.lastVerificationRequest.getTime() < 15 * 60 * 1000) {
      return NextResponse.json(
        { success: false, message: 'Please wait before requesting again.' },
        { status: 429 }
      );
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 3600000; // 1 hour

    // Update user with new token and expiry
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;

    // Optional: Update tracking fields
    user.verificationRequests += 1;
    user.lastVerificationRequest = new Date();

    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    const emailBody = `
      <h1>Email Verification</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.MY_EMAIL, // Verified sender email
      subject: 'Verify Your Email',
      html: emailBody,
    };

    await sgMail.send(msg);

    return NextResponse.json(
      { success: true, message: 'Verification email has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend Verification Email Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
