import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import crypto from 'crypto';
import User from '@/models/user';

export async function POST(request) {
    try {
        const { token } = await request.json();

        await connectToDB();

        const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex'); 

        const userData = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!userData) {
            return NextResponse.json({ message: "Invalid token or it has expired" }, { status: 400 });
        }

        return NextResponse.json(userData, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
