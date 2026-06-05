'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuthToken } from '@/lib/api';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const reference = params.get('reference');
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    if (!reference) { setStatus('failed'); return; }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    fetch(`${apiBase}/payments/verify?reference=${reference}`, {
      headers: { Authorization: `Bearer ${getAuthToken() || ''}` },
    })
      .then(r => r.json())
      .then(data => {
        setStatus(data.status === 'success' ? 'success' : 'failed');
      })
      .catch(() => setStatus('failed'));
  }, [reference]);

  if (status === 'verifying') return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4"
      style={{ background: 'var(--bg-primary)' }}>
      <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
      <p style={{ color: 'var(--text-secondary)' }}>Verifying payment…</p>
    </div>
  );

  if (status === 'success') return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-6 text-center"
      style={{ background: 'var(--bg-primary)' }}>
      <span className="text-7xl">✅</span>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Payment Successful!</h1>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Your order is confirmed. You&apos;ll receive a WhatsApp update shortly.
      </p>
      <button onClick={() => router.push('/profile/orders')}
        className="mt-2 px-8 py-3 rounded-full font-bold text-sm"
        style={{ background: 'var(--accent-gold)', color: '#000' }}>
        View Orders
      </button>
      <button onClick={() => router.push('/')}
        className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-6 text-center"
      style={{ background: 'var(--bg-primary)' }}>
      <span className="text-7xl">❌</span>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Payment Failed</h1>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Something went wrong. Your order was not placed.
      </p>
      <button onClick={() => router.push('/checkout')}
        className="mt-2 px-8 py-3 rounded-full font-bold text-sm"
        style={{ background: 'var(--accent-gold)', color: '#000' }}>
        Try Again
      </button>
    </div>
  );
}
