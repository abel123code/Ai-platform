import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import user from '@/models/user';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email format (optional but recommended)
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if user exists
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      // For security, do not reveal whether the email exists
      return NextResponse.json(
        { message: 'If that email is registered, a reset link has been sent.' },
        { status: 200 }
      );
    }

    // Create reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash the reset token before saving to the database
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token expiration to 1 hour (3600000 ms)
    const passwordResetExpire = Date.now() + 3600000; // 1 hour

    // Update user with reset token and expiration
    existingUser.resetToken = passwordResetToken;
    existingUser.resetTokenExpiry = passwordResetExpire;

    // Save the updated user to the database
    await existingUser.save();

    // Construct reset URL
    const resultUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    //console.log('Password Reset URL:', resultUrl);

    // Email content
    const body = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resultUrl}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    // Configure SendGrid
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API Key is not set');
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.MY_EMAIL, // Ensure this email is verified with SendGrid
      subject: 'Reset Your Password',
      html: body,
    };

    try {
      await sgMail.send(msg);
      return NextResponse.json(
        { message: 'Password reset email has been sent.' },
        { status: 200 }
      );
    } catch (error) {
      console.error('SendGrid Error:', error);

      // Remove reset token and expiration if email sending fails
      existingUser.resetToken = undefined;
      existingUser.resetTokenExpiry = undefined;
      await existingUser.save();

      return NextResponse.json(
        { message: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Forget Password Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
