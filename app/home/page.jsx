import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../component/ui/Card'
import { Button } from '@/component/ui/Button';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';
import Link from 'next/link';

// Replace your existing courseCategories array with this
const courseCategories = [
  { id: 1, name: "Development", icon: "💻", courses: 15, route: "development" },
  { id: 2, name: "Business", icon: "💼", courses: 12, route: "business" },
  { id: 3, name: "Finance & Accounting", icon: "📊", courses: 8, route: "finance-accounting" },
  { id: 4, name: "IT & Software", icon: "🖥️", courses: 10, route: "it-software" },
  { id: 5, name: "Office Productivity", icon: "📁", courses: 7, route: "office-productivity" },
  { id: 6, name: "Personal Development", icon: "🌱", courses: 9, route: "personal-development" },
  { id: 7, name: "Design", icon: "🎨", courses: 6, route: "design" },
  { id: 8, name: "Marketing", icon: "📣", courses: 8, route: "marketing" },
  { id: 9, name: "Lifestyle", icon: "🏖️", courses: 5, route: "lifestyle" },
  { id: 10, name: "Photography & Video", icon: "📷", courses: 7, route: "photography-video" },
  { id: 11, name: "Health & Fitness", icon: "🏋️‍♂️", courses: 4, route: "health-fitness" },
  { id: 12, name: "Music", icon: "🎵", courses: 5, route: "music" },
  { id: 13, name: "Teaching & Academics", icon: "📚", courses: 6, route: "teaching-academics" },
];


export default async function ContentPage() {
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, redirect to the login page
  if (!session) {
    redirect('/');
  }
  
  await connectToDB();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User Plan Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="rounded-xl">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome back, {session.user.name}
            </CardTitle>
            <CardDescription className="text-gray-300">
              Start learning today!
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Content Section */}
        <div className="flex flex-col min-h-screen bg-gray-900">
          <main className="flex-grow py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-extrabold text-white mb-12 text-center">
                Explore Our Courses
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {courseCategories.map((category) => (
                  <Card key={category.id} className="bg-gray-800 p-3 border-gray-700 hover:bg-gray-700 transition-colors duration-200 hover:cursor-pointer flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-white">{category.icon} {category.name}</CardTitle>
                      {/* <CardDescription className="text-gray-400">{category.courses} courses</CardDescription> */}
                    </CardHeader>
                    <CardContent className='flex-grow'>
                      <p className="text-gray-300">Discover our {category.name.toLowerCase()} courses and enhance your skills.</p>
                    </CardContent>
                    <CardFooter>
                    <Link href={`/courses/${category.route}`} passHref>
                      <Button
                        variant="outline"
                        className="w-full text-white border-gray-600 hover:bg-gray-700 mt-auto"
                      >
                        View Courses
                      </Button>
                    </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
