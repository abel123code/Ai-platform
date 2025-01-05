// components/EnhancedCoursePlayer.js

'use client';

import { useState, useEffect, useTransition } from 'react';
import axios from 'axios';
import { Button } from '@/component/ui/Button';
import { Book, CheckCircle, ChevronDown, ChevronRight  } from 'lucide-react';
import { markLessonCompleted } from '@/app/learn-content/[courseId]/actions';
import ReactPlayer from 'react-player';
import LoadingSpinner from './LoadingSpinner';


export default function EnhancedCoursePlayer({ courseId }) {
  // Existing state variables and useEffect
  const [userProgress, setUserProgress] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}`);
        setUserProgress(response.data.userProgress);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [courseId]);

  // Existing functions (toggleModule, selectLesson, etc.)
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const selectLesson = (lesson) => {
    setActiveLesson(lesson);
  };

  const totalLessons = userProgress
    ? userProgress.progress.curriculum.reduce(
        (total, module) => total + module.lectures.length,
        0
      )
    : 0;

  const completedLessons = userProgress
    ? userProgress.progress.curriculum.reduce(
        (total, module) =>
          total + module.lectures.filter((lecture) => lecture.completed).length,
        0
      )
    : 0;

  const overallProgress =
    totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;

  const markLessonAsCompletedHandler = (sectionTitle, lectureTitle) => {
    startTransition(async () => {
      try {
        const updatedProgress = await markLessonCompleted({
          courseId,
          sectionTitle,
          lectureTitle,
        });

        // Update the local state with the new progress
        setUserProgress((prev) => ({
          ...prev,
          progress: updatedProgress,
        }));
      } catch (error) {
        console.error('Error updating lesson progress:', error);
      }
    });
  };

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  if (!userProgress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Error loading course. Please try again later.</p>
      </div>
    );
  }

  const courseData = userProgress.progress;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="md:w-80 bg-gray-800 overflow-y-auto order-2 md:order-1">
        <div className="p-4 md:p-6">
          <h2 className="text-2xl font-bold mb-4 md:mb-6 flex items-center">
            <Book className="h-6 w-6 mr-2" />
            Course Modules
          </h2>
          {courseData.curriculum.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-2 md:mb-4">
              <Button
                variant="ghost"
                className="w-full justify-between text-left hover:bg-gray-700 transition-colors"
                onClick={() => toggleModule(moduleIndex)}
              >
                <span className="flex items-center">{module.sectionTitle}</span>
                {expandedModules[moduleIndex] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              {expandedModules[moduleIndex] && (
                <ul className="ml-4 md:ml-6 mt-1 md:mt-2 space-y-1 md:space-y-2">
                  {module.lectures.map((lecture, lectureIndex) => (
                    <li key={lectureIndex} className='flex flex-col'>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm hover:bg-gray-700 transition-colors"
                        onClick={() => selectLesson(lecture)}
                      >
                        <span className="flex items-center">
                          {lecture.completed ? (
                            <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 mr-2 rounded-full border border-gray-500 shrink-0" />
                          )}
                          {lecture.title}
                        </span>
                      </Button>
                      {!lecture.completed && (
                        <Button
                          variant="link"
                          className="ml-8 text-blue-500 hover:underline"
                          onClick={() =>
                            markLessonAsCompletedHandler(
                              module.sectionTitle,
                              lecture.title
                            )
                          }
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 flex flex-col order-1 md:order-2">
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-800 rounded-lg mb-4 md:mb-8 relative overflow-hidden">
          {activeLesson ? (
            <>
              <div className="w-full h-full aspect-w-16 aspect-h-9">
                <ReactPlayer
                  url={activeLesson.videoURL}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
              <h2 className="my-4 text-xl font-semibold text-center">
                {activeLesson.title}
              </h2>
            </>
          ) : (
            <div className="text-center p-4">
              <h1 className="text-3xl font-bold mb-4">
                Welcome to the Course
              </h1>
              <p className="text-xl text-gray-400">
                Select a lesson from the sidebar to start learning.
              </p>
            </div>
          )}
        </div>

        {/* Overall course progress */}
        <div className="flex items-center justify-center mb-4 md:mb-0">
          <div className="relative">
          <svg className="w-32 h-32" viewBox="0 0 100 100">
              <circle
                className="text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-blue-500"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (overallProgress / 100) * 251.2}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">
                {Math.round(overallProgress)}%
              </span>
              <span className="text-sm text-gray-400">Complete</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
