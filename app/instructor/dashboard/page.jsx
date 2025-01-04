import React from 'react'
import DashboardLayout from '@/component/instructor/DashboardLayout'
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import teacherApplication from '@/models/teacherApplication';

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id

  if (!session) {
    redirect('/login')
  }

  const teacherData = await teacherApplication.findOne({ userId: userId });
  if (teacherData?.status !== 'Approved') {
    redirect('/teach-with-us/learn-more')
  }

  return (
    <DashboardLayout />
  )
}

export default Dashboard