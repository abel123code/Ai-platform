import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { connectToDB } from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import Course from '@/models/Course';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CourseCard from '@/component/CourseCard';
import { Button } from '@/component/ui/Button';
import Link from 'next/link';

// Helper function to calculate total course duration
function calculateCourseDuration(course) {
    let totalMinutes = 0;
    course.modules.forEach((module) => {
        module.lessons.forEach((lesson) => {
            const duration = lesson.duration;
            // Extract the number of minutes from the duration string
            const minutes = parseInt(duration);
            totalMinutes += minutes;
        });
    });
    // Convert minutes to a more readable format, e.g., hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
}

export default async function MyCoursesPage() {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    // Connect to the database
    await connectToDB();

    // Fetch purchases with status 'succeeded' for the user
    const purchases = await Purchase.find({
        user: session.user.id,
        status: 'succeeded',
    }).lean();

    // Extract course IDs from purchases
    const courseIds = purchases.map(purchase => purchase.course.toString());

    if (courseIds.length === 0) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-50 py-8">
                <div className="container mx-auto px-4 flex flex-col text-center justify-center">
                    <h1 className="text-4xl font-bold mb-6">My Courses</h1>
                    <p>You have not purchased any courses yet.</p>
                    <Link href="/home">
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                            Browse Courses
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Fetch course details based on courseIds
    const courses = await Course.find({
        _id: { $in: courseIds },
    }).lean();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6">My Courses</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <CourseCard
                            key={course._id}
                            id={course._id.toString()}
                            title={course.courseTitle}
                            category={course.category}
                            duration={calculateCourseDuration(course)}
                            // level="Intermediate" // Adjust as per your data or make dynamic
                            // students={0} // Replace with actual data if available
                            // rating={0} // Replace with actual data if available
                            noOfModule={course.modules.length}
                            buttonLabel="Start Learning"
                            buttonLink={`/learn-content/${course._id}`} // Redirect to your learning page
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
