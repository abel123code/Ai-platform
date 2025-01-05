'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PurchaseButton({ courseId }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/pay/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again later.');
        console.error(data.error);
        setLoading(false);  
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setErrorMsg("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <Button
        className="w-full sm:w-auto py-2 px-4 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        size="lg"
        onClick={handlePurchase}
        disabled={loading}
      >
          {loading ? 'Processing...' : 'Purchase Now'}
      </Button>
      {errorMsg && <p className="text-red-500 mt-2 text-xs">Error purchasing course. Please try again.</p>}
    </div>
    
  );
}
