import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const { password, email } = await request.json();

        await connectToDB();

        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return NextResponse.json(
                { message: 'User not found.' },
                { status: 404 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);
        existingUser.password = hashedPassword;

        // Clear reset token fields
        existingUser.resetToken = undefined; 
        existingUser.resetTokenExpiry = undefined; 

        // Save the updated user
        await existingUser.save();

        return NextResponse.json(
            { message: 'User password is updated.' },
            { status: 200 }
        );
    } catch (error) {   
        console.error('Error updating password:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
