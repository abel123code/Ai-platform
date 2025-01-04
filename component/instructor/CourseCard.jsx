// components/CourseCard.jsx

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CourseCard({ course }) {
  const { courseTitle, courseDescription, status, _id } = course;

  // Function to capitalize status
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <Card className="bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{courseTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-gray-300">{courseDescription}</p>
        <p className="mb-2">
          Status:{' '}
          <span
            className={`${
              status === 'Approved'
                ? 'text-green-500'
                : status === 'Pending'
                ? 'text-yellow-500'
                : 'text-red-500'
            } font-semibold`}
          >
            {capitalize(status)}
          </span>
        </p>
        {/* Link to course details or edit page */}
        <Link href={''}>
          <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
            View Details
          </button>
        </Link>
      </CardContent>
    </Card>
  );
}
