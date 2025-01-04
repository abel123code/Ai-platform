// app/teacher/my-courses/page.jsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Course from '@/models/Course';
import { connectToDB } from '@/lib/mongodb';
import CoursesList from '@/component/instructor/CourseList';
import teacherApplication from '@/models/teacherApplication';
import Sidebar from '@/component/instructor/Sidebar';
import Link from 'next/link';
import { Button } from '@/component/ui/Button';
import { ArrowLeft } from "lucide-react"

export default async function MyCoursesPage() {
  // Connect to the database
  await connectToDB();

  // Get the user's session
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to login
  if (!session) {
    redirect('/login');
  }
  const userId = session?.user?.id
  const teacherData = await teacherApplication.findOne({ userId: userId });
  if (teacherData?.status !== 'Approved') {
    redirect('/teach-with-us/learn-more')
  }

  // Fetch the teacher's courses
  const courses = await Course.find({ instructor: session.user.id }).lean();

  const serializedCourses = courses.map((course) => ({
    ...course,
    _id: course._id.toString(),
    instructor: course.instructor.toString(),
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    // If modules and lessons contain ObjectIds, serialize them as well
    modules: course.modules.map((module) => ({
      ...module,
      _id: module._id.toString(),
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        _id: lesson._id.toString(),
      })),
    })),
  }));

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
        <Link href='/instructor/dashboard' passHref>
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center m-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <main className="flex-1 px-8 overflow-y-auto">
            <CoursesList courses={serializedCourses} />
        </main>
    </div>
  );
}
