'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

export default function CartPage() {
  const router = useRouter();
  const { items, increment, decrement, remove, total, count } = useCartStore();
  const subtotal = total();
  const delivery = subtotal > 0 ? 5_000 : 0;
  const grandTotal = subtotal + delivery;

  if (items.length === 0) return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4"
      style={{ background: 'var(--bg-primary)' }}>
      <span className="text-6xl">🛒</span>
      <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Your cart is empty</p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add some items to get started</p>
      <button onClick={() => router.push('/')}
        className="mt-2 px-6 py-3 rounded-full font-semibold text-sm"
        style={{ background: 'var(--accent-gold)', color: '#000' }}>
        Browse Products
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen pb-40" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(3,3,3,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => router.back()} className="text-xl">←</button>
        <span className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
          Cart <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>({count()} items)</span>
        </span>
      </header>

      {/* Items */}
      <div className="px-4 mt-4 flex flex-col gap-3">
        {items.map(item => (
          <div key={item.id} className="card-luxury p-3 flex items-center gap-3">
            <span className="text-4xl flex-shrink-0">{item.image}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--accent-gold)' }}>{formatNaira(item.price)}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => decrement(item.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                −
              </button>
              <span className="w-5 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {item.quantity}
              </span>
              <button onClick={() => increment(item.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--accent-gold)', color: '#000' }}>
                +
              </button>
            </div>
            <button onClick={() => remove(item.id)} className="ml-1 text-lg flex-shrink-0"
              style={{ color: 'var(--text-muted)' }}>×</button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mx-4 mt-6 rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border-subtle)' }}>
        <p className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest"
          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
          Order Summary
        </p>
        {[
          { label: 'Subtotal', value: formatNaira(subtotal) },
          { label: 'Delivery', value: formatNaira(delivery) },
        ].map(row => (
          <div key={row.label} className="flex justify-between px-4 py-2.5 text-sm"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
            <span style={{ color: 'var(--text-primary)' }}>{row.value}</span>
          </div>
        ))}
        <div className="flex justify-between px-4 py-3 text-base font-bold">
          <span style={{ color: 'var(--text-primary)' }}>Total</span>
          <span style={{ color: 'var(--accent-gold)' }}>{formatNaira(grandTotal)}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 flex flex-col gap-2"
        style={{ background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={() => router.push('/checkout')}
          className="w-full py-4 rounded-xl font-bold text-base"
          style={{ background: 'var(--accent-gold)', color: '#000' }}>
          Proceed to Checkout → {formatNaira(grandTotal)}
        </button>
        <button onClick={() => router.push('/')}
          className="w-full py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
