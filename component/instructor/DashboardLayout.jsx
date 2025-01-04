'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menu } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import CreateCourseForm from './CreateCourseForm';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();


  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Welcome, {session?.user.username}!</h2>
            <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            >
                <Menu className="h-6 w-6" />
            </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-gray-800">
                <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-gray-700 py-2 px-4 rounded-md"
                >
                    Overview
                </TabsTrigger>
                <TabsTrigger
                    value="create-course"
                    className="data-[state=active]:bg-gray-700 py-2 px-4 rounded-md"
                >
                    Create Course
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                {/* <OverviewTab /> */}
                Overview
            </TabsContent>

            <TabsContent value="create-course" className="space-y-4">
                <CreateCourseForm />
            </TabsContent>
        </Tabs>
        </main>
    </div>
  );
}
