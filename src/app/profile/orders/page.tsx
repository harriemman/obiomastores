'use client';

import { useRouter } from 'next/navigation';

const MOCK_ORDERS = [
  { id: 'ORD-001', date: '2025-05-20', status: 'delivered', total: 1_850_000, items: [{ title: 'iPhone 15 Pro Max', qty: 1 }] },
  { id: 'ORD-002', date: '2025-05-15', status: 'shipped',   total: 380_000,   items: [{ title: 'Sony WH-1000XM5', qty: 1 }] },
  { id: 'ORD-003', date: '2025-05-10', status: 'processing', total: 2_400_000, items: [{ title: 'MacBook Pro M3', qty: 1 }] },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; icon: string }> = {
  pending:    { bg: 'rgba(201,168,76,0.15)',   color: 'var(--accent-gold)', label: 'Pending',    icon: '⏳' },
  paid:       { bg: 'rgba(0,212,255,0.15)',    color: 'var(--accent-cyan)', label: 'Paid',       icon: '✅' },
  processing: { bg: 'rgba(0,212,255,0.15)',    color: 'var(--accent-cyan)', label: 'Processing', icon: '🔄' },
  shipped:    { bg: 'rgba(100,200,100,0.15)',  color: '#6dc878',            label: 'Shipped',    icon: '🚚' },
  delivered:  { bg: 'rgba(100,200,100,0.15)',  color: '#6dc878',            label: 'Delivered',  icon: '✅' },
  cancelled:  { bg: 'rgba(255,80,80,0.15)',    color: '#ff5050',            label: 'Cancelled',  icon: '❌' },
};

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen pb-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(3,3,3,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => router.back()} className="text-xl">←</button>
        <span className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>My Orders</span>
      </header>

      {MOCK_ORDERS.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-24">
          <span className="text-6xl">📦</span>
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No orders yet</p>
          <button onClick={() => router.push('/')}
            className="px-6 py-3 rounded-full font-semibold text-sm"
            style={{ background: 'var(--accent-gold)', color: '#000' }}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="px-4 mt-4 flex flex-col gap-3">
          {MOCK_ORDERS.map(order => {
            const s = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending;
            return (
              <div key={order.id} className="card-luxury p-4">
                {/* Order header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{order.id}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{order.date}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: s.bg, color: s.color }}>
                    {s.icon} {s.label}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-3" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {item.title} ×{item.qty}
                    </p>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold" style={{ color: 'var(--accent-gold)' }}>
                    {formatNaira(order.total)}
                  </p>
                  <button className="px-4 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--accent-gold)', border: '1px solid var(--border-glow)' }}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
