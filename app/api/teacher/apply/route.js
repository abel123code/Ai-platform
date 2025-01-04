import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import TeacherApplication from '@/models/teacherApplication';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    await connectToDB();

    // Parse the JSON body
    const data = await request.json();

    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // Check if the user already has an application
    const existingApplication = await TeacherApplication.findOne({ userId });
    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already submitted an application.' },
        { status: 400 }
      );
    }

    // Create a new teacher application
    const application = new TeacherApplication({
      ...data,
      userId,
    });

    // Save the application to the database
    await application.save();

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
