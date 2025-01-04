'use client';

import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import Link from 'next/link';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">Teacher Portal</h1>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="mt-6">
        <Button
          variant="ghost"
          className="w-full justify-start p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Link href='/instructor/my-course'>
            <Button
            variant="ghost"
            className="w-full justify-start p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
            <BookOpen className="mr-2 h-4 w-4" />
            My Courses
            </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <Users className="mr-2 h-4 w-4" />
          Students
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
    </aside>
  );
}
