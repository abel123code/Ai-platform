import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Course from '@/models/Course';
import { connectToDB } from '@/lib/mongodb';

export async function POST(request) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const instructor = session.user.id;

    const data = await request.json();

    // Create a new course document
    const course = new Course({
      ...data,
      instructor,
      status: 'Pending',
      priceId: 'TBC'
    });

    await course.save();

    return NextResponse.json(
      { message: 'Course submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting course:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
