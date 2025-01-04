import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import TeacherApplication from '@/models/teacherApplication';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const application = await TeacherApplication.findOne({ userId });

    if (!application) {
      return NextResponse.json({ status: 'No Application' }, { status: 200 });
    }

    return NextResponse.json({ status: application.status }, { status: 200 });
  } catch (error) {
    console.error('Error fetching application status:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
