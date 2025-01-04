'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/Button';

export default function PurchaseButton({ courseId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    setLoading(true);
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
        console.error(data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full sm:w-auto"
      size="lg"
      onClick={handlePurchase}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Purchase Now'}
    </Button>
  );
}
