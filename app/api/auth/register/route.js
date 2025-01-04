import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail'; // For sending emails

// Define a schema for input validation using Zod
const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    const parsedData = registrationSchema.safeParse({ email, password });
    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.errors[0].message },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Derive username from email
    const username = email.split('@')[0].toLowerCase();

    // Check if username is unique; if not, append a number
    let finalUsername = username;
    let userCount = 1;
    while (await User.findOne({ username: finalUsername })) {
      finalUsername = `${username}${userCount}`;
      userCount++;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 3600000; // 1 hour

    // Create new user
    await User.create({
      email,
      username: finalUsername,
      password: hashedPassword,
      image: '',
      isVerified: false,
      verificationToken: verificationToken,
      verificationTokenExpiry: verificationTokenExpiry,
      role: 'Student'
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    const emailBody = `
      <h1>Email Verification</h1>
      <p>Thank you for registering. Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `;

    // Configure SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.MY_EMAIL, 
      subject: 'Verify Your Email',
      html: emailBody,
    };

    await sgMail.send(msg);

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
