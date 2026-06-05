'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { createOrder } from '@/lib/api';

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

type Step = 'address' | 'payment' | 'confirm';

const PAYMENT_METHODS = [
  { id: 'paystack', label: 'Card / Bank Transfer', icon: '💳', sub: 'Paystack — Visa, Verve, Mastercard' },
  { id: 'transfer', label: 'Bank Transfer', icon: '🏦', sub: 'Manual transfer + confirmation' },
  { id: 'wallet', label: 'Wallet Balance', icon: '💰', sub: '₦0.00 available' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCartStore();
  const [step, setStep] = useState<Step>('address');
  const [payMethod, setPayMethod] = useState('paystack');
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', state: 'Lagos',
  });

  const subtotal = total();
  const delivery = 5_000;
  const grandTotal = subtotal + delivery;

  const handlePlace = async () => {
    setPlacing(true);
    try {
      await createOrder({
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        deliveryAddress: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
        },
        paymentMethod: payMethod as 'paystack' | 'bank-transfer' | 'cod',
      });
      clear();
      setDone(true);
    } catch (e: any) {
      alert(e?.message || 'Order failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (done) return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-5 px-6 text-center"
      style={{ background: 'var(--bg-primary)' }}>
      <span className="text-7xl">✅</span>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Order Placed!</h1>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        You&apos;ll receive a WhatsApp confirmation shortly.
      </p>
      <button onClick={() => router.push('/')}
        className="mt-2 px-8 py-3 rounded-full font-bold text-sm"
        style={{ background: 'var(--accent-gold)', color: '#000' }}>
        Back to Shop
      </button>
    </div>
  );

  if (items.length === 0) { router.replace('/cart'); return null; }

  return (
    <div className="flex flex-col min-h-screen pb-36" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(3,3,3,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => step === 'address' ? router.back() : setStep(step === 'payment' ? 'address' : 'payment')}
          className="text-xl">←</button>
        <span className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>Checkout</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {step === 'address' ? '1/3' : step === 'payment' ? '2/3' : '3/3'}
        </span>
      </header>

      {/* Step indicator */}
      <div className="flex mx-4 mt-4 gap-1">
        {(['address', 'payment', 'confirm'] as Step[]).map((s, i) => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all"
            style={{ background: ['address', 'payment', 'confirm'].indexOf(step) >= i ? 'var(--accent-gold)' : 'var(--border-subtle)' }} />
        ))}
      </div>

      {/* Step: Address */}
      {step === 'address' && (
        <div className="px-4 mt-6 flex flex-col gap-4">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>DELIVERY ADDRESS</p>
          {[
            { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
            { key: 'phone', label: 'Phone', placeholder: '+234 800 000 0000' },
            { key: 'address', label: 'Street Address', placeholder: '12 Banana Island Road' },
            { key: 'city', label: 'City', placeholder: 'Lagos' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{field.label}</label>
              <input
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)', caretColor: 'var(--accent-gold)'
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Step: Payment */}
      {step === 'payment' && (
        <div className="px-4 mt-6 flex flex-col gap-3">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>PAYMENT METHOD</p>
          {PAYMENT_METHODS.map(m => (
            <button key={m.id} onClick={() => setPayMethod(m.id)}
              className="card-luxury p-4 flex items-center gap-3 text-left w-full transition-all"
              style={{ borderColor: payMethod === m.id ? 'var(--accent-gold)' : undefined }}>
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.sub}</p>
              </div>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: payMethod === m.id ? 'var(--accent-gold)' : 'var(--border-subtle)' }}>
                {payMethod === m.id && (
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-gold)' }} />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && (
        <div className="px-4 mt-6 flex flex-col gap-4">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>ORDER SUMMARY</p>
          <div className="card-luxury p-4 flex flex-col gap-2">
            {items.map(i => (
              <div key={i.id} className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>{i.title} ×{i.quantity}</span>
                <span style={{ color: 'var(--text-primary)' }}>{formatNaira(i.price * i.quantity)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between text-sm font-bold"
              style={{ borderColor: 'var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatNaira(delivery)}</span>
            </div>
            <div className="flex justify-between text-base font-bold mt-1">
              <span style={{ color: 'var(--text-primary)' }}>Total</span>
              <span style={{ color: 'var(--accent-gold)' }}>{formatNaira(grandTotal)}</span>
            </div>
          </div>

          <div className="card-luxury p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <p>📍 {form.address}, {form.city}</p>
            <p className="mt-1">📞 {form.phone}</p>
            <p className="mt-1">💳 {PAYMENT_METHODS.find(m => m.id === payMethod)?.label}</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4"
        style={{ background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-subtle)' }}>
        {step !== 'confirm' ? (
          <button
            onClick={() => setStep(step === 'address' ? 'payment' : 'confirm')}
            className="w-full py-4 rounded-xl font-bold text-base"
            style={{ background: 'var(--accent-gold)', color: '#000' }}>
            Continue →
          </button>
        ) : (
          <button onClick={handlePlace} disabled={placing}
            className="w-full py-4 rounded-xl font-bold text-base transition-opacity"
            style={{ background: 'var(--accent-gold)', color: '#000', opacity: placing ? 0.6 : 1 }}>
            {placing ? 'Placing Order…' : `Place Order · ${formatNaira(grandTotal)}`}
          </button>
        )}
      </div>
    </div>
  );
}
