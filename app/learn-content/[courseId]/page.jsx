'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/component/ui/Button';
import { Book, Video, CheckCircle, ChevronDown, ChevronRight, Play } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import EnhancedCoursePlayer from '@/component/EnhancedCoursePlayer';
import { Progress } from "@/components/ui/progress"
import LoadingSpinner from '@/component/LoadingSpinner';

export default function LearnContentPage() {
  const router = useRouter();
  const params = useParams(); // Use useParams to access dynamic route parameters
  const { courseId } = params; // Destructure courseId from params
  //console.log('Course ID:', courseId);

  const { data: session, status } = useSession();

  const [hasPurchased, setHasPurchased] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      // Redirect to sign-in if not authenticated
      router.push('/api/auth/signin');
      return;
    }

    // Function to check purchase status
    const checkPurchase = async () => {
      try {
        const response = await axios.post('/api/pay/check-purchase', { courseId });
        setHasPurchased(response.data.hasPurchased);
      } catch (error) {
        console.error('Error checking purchase status:', error);
        setHasPurchased(false);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      checkPurchase();
    } else {
      // If courseId is not present, redirect to home or show an error
      console.error('No courseId found in the URL.');
      router.push('/home');
    }
  }, [session, status, courseId, router]);

  useEffect(() => {
    if (!loading && hasPurchased === false) {
      router.push(`/home`);
    }
  }, [loading, hasPurchased, router, courseId]);

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  if (hasPurchased) {
    return <EnhancedCoursePlayer courseId={courseId} />;
  } else {
    router.push('/home')
  }
}
