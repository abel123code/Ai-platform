import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { connectToDB } from '@/lib/mongodb';
import Course from '@/models/Course';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { BookOpenIcon, ArrowLeftIcon, CalendarDays, Clock, GraduationCap } from "lucide-react";
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle} from '../../../component/ui/Card'
import { Button } from '@/component/ui/Button';
import PurchaseButton from '@/component/PurchaseButton';
import Purchase from '@/models/Purchase';

// Helper function to calculate total course duration
function calculateTotalDuration(course) {
  let totalMinutes = 0;
  course.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      const duration = lesson.duration;
      // Extract the number of minutes from the duration string
      const minutes = parseInt(duration);
      totalMinutes += minutes;
    });
  });
  return totalMinutes;
}


export default async function CourseInfo({ params }) {
  const courseId = params.id;

  // Connect to the database
  await connectToDB();

  // Fetch course data
  const course = await Course.findById(courseId).lean();

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <h1 className="text-2xl">Course not found</h1>
      </div>
    );
  }

  // Get user session
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  // Check if the user has already purchased the course
  const hasPurchased = await Purchase.exists({
    user: session.user.id,
    course: courseId,
    status: 'succeeded',
  });

  if (hasPurchased) {
    // Redirect to the learning content page
    redirect(`/learn-content/${courseId}`);
// Replace with your actual learning page route
  }

  // Calculate total duration
  const totalDuration = calculateTotalDuration(course);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/home" passHref>
            <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl md:text-2xl font-bold mb-6 text-slate-50 flex gap-2 items-center">
          {course.courseTitle}
        </h1>
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Course Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              {course.courseDescription}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Course Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {course.modules.map((module, index) => (
                <AccordionItem key={index} value={`module-${index + 1}`}>
                  <AccordionTrigger className="text-slate-200 hover:text-slate-50 flex sm:justify-start justify-center">
                    {module.moduleTitle}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2 text-slate-300">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex}>
                        <span className="font-semibold">{lesson.lessonTitle}</span>
                        <span className="text-sm text-muted-foreground"> - {lesson.duration}</span>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </li>
                    ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4 items-center">
          <div className="mb-4 sm:mb-0">
            <span className="text-2xl font-bold text-emerald-400">{course.price}</span>
            <span className="ml-2 text-slate-300">SGD</span>
          </div>
          <PurchaseButton courseId={courseId} />
        </div>
      </div>
    </div>
  );
}
