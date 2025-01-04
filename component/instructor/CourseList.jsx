'use client';

import CourseCard from './CourseCard';

export default function CoursesList({ courses }) {
  return (
    <div className="container px-4 py-8 bg-gray-900 min-h-full">
      <h1 className="text-3xl text-white font-bold mb-6">My Courses</h1>
      {courses.length === 0 ? (
        <p>You have not created any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
