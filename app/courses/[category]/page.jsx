import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { connectToDB } from '@/lib/mongodb';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle} from '../../../component/ui/Card'
import { Button } from '@/component/ui/Button';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CourseCard from '@/component/CourseCard';
import Course from '@/models/Course';

export default async function CategoryPage({ params }) {
  const { category } = params;

  // Fetch the session on the server
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, redirect to the login page
  if (!session) {
    redirect('/');
  }

  await connectToDB();

  // Fetch courses based on category from the database
  const courses = await Course.find({ category: category, status: 'Approved'}).lean();

  // Convert _id to string to avoid serialization issues
  const coursesWithStringId = courses.map((course) => ({
    ...course,
    _id: course._id.toString(),
  }));

  // Map the route parameter back to the display name
  const categoryNameMap = {
    development: 'Development',
    business: 'Business',
    'finance-accounting': 'Finance & Accounting',
    'it-software': 'IT & Software',
    'office-productivity': 'Office Productivity',
    'personal-development': 'Personal Development',
    design: 'Design',
    marketing: 'Marketing',
    // lifestyle: 'Lifestyle',
    'photography-video': 'Photography & Video',
    'health-fitness': 'Health & Fitness',
    // music: 'Music',
    // 'teaching-academics': 'Teaching & Academics',
  };

  const categoryName = categoryNameMap[category] || 'Courses';

  // Handle invalid categories
  if (!categoryNameMap[category]) {
    redirect('/courses'); // Redirect back to courses main page
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-extrabold text-white mb-12 text-center">
        {categoryName} Courses
      </h1>
      <div className="text-center mb-8">
        <Link href="/home" passHref>
          <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
            Back to Home
          </Button>
        </Link>
      </div>
      {coursesWithStringId.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {coursesWithStringId.map((course, index) => (
            <CourseCard key={course._id} id={course._id} title={course.courseTitle} category={course.subcategory} noOfModule={course.modules.length} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No courses available under this category.
        </p>
      )}
    </div>
  );
}
