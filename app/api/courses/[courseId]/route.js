import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserCourseProgress from '@/models/UserCourseProgress';
import { connectToDB } from '@/lib/mongodb';

export async function GET(request, { params }) {
  const { courseId } = params;

  // Get the user session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDB();

  // Fetch user progress and course data from UserCourseProgress collection
  const userProgress = await UserCourseProgress.findOne({
    user: session.user.id,
    course: courseId,
  }).lean();

  if (!userProgress) {
    return NextResponse.json({ error: 'Not Authorized' }, { status: 403 });
  }

  return NextResponse.json({ userProgress });
}
