import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Purchase from '@/models/Purchase';
import { connectToDB } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    await connectToDB();

    const hasPurchased = await Purchase.exists({
      user: session.user.id,
      course: courseId,
      status: 'succeeded',
    });

    return NextResponse.json({ hasPurchased });
  } catch (error) {
    console.error('Error in check-purchase API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
