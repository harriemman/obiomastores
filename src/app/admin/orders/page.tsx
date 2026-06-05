'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ALL_ORDERS = [
  { id: 'ORD-247', customer: 'Adaeze N.', phone: '+234 801 234 5678', total: 1_850_000, status: 'pending',    items: 1, time: '2m ago' },
  { id: 'ORD-246', customer: 'Emeka O.',  phone: '+234 802 345 6789', total: 380_000,   status: 'paid',       items: 1, time: '15m ago' },
  { id: 'ORD-245', customer: 'Fatima A.', phone: '+234 803 456 7890', total: 2_400_000, status: 'processing', items: 1, time: '1h ago' },
  { id: 'ORD-244', customer: 'Chidi I.',  phone: '+234 804 567 8901', total: 220_000,   status: 'shipped',    items: 2, time: '3h ago' },
  { id: 'ORD-243', customer: 'Ngozi U.',  phone: '+234 805 678 9012', total: 780_000,   status: 'delivered',  items: 1, time: '1d ago' },
  { id: 'ORD-242', customer: 'Bola T.',   phone: '+234 806 789 0123', total: 450_000,   status: 'cancelled',  items: 1, time: '2d ago' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  pending:    { bg: 'rgba(201,168,76,0.15)',  color: 'var(--accent-gold)', icon: '⏳' },
  paid:       { bg: 'rgba(0,212,255,0.15)',   color: 'var(--accent-cyan)', icon: '✅' },
  processing: { bg: 'rgba(0,212,255,0.15)',   color: 'var(--accent-cyan)', icon: '🔄' },
  shipped:    { bg: 'rgba(100,200,100,0.15)', color: '#6dc878',            icon: '🚚' },
  delivered:  { bg: 'rgba(100,200,100,0.15)', color: '#6dc878',            icon: '✅' },
  cancelled:  { bg: 'rgba(255,80,80,0.15)',   color: '#ff5050',            icon: '❌' },
};

const FILTERS = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = ALL_ORDERS.filter(o => filter === 'all' || o.status === filter);

  return (
    <div className="flex flex-col min-h-screen pb-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => router.back()} className="text-xl">←</button>
        <span className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
          Orders <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>({filtered.length})</span>
        </span>
      </header>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 capitalize"
            style={{
              background: filter === f ? 'var(--accent-gold)' : 'var(--bg-card)',
              color: filter === f ? '#000' : 'var(--text-muted)',
              border: `1px solid ${filter === f ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="px-4 mt-3 flex flex-col gap-2">
        {filtered.map(order => {
          const s = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending;
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} className="card-luxury overflow-hidden">
              {/* Row */}
              <button className="w-full px-4 py-3 flex items-center gap-3 text-left"
                onClick={() => setExpanded(isOpen ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{order.id}</p>
                    <span className="px-1.5 py-0.5 rounded text-xs font-semibold"
                      style={{ background: s.bg, color: s.color }}>
                      {s.icon} {order.status}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {order.customer} · {order.time}
                  </p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                  <p className="text-sm font-bold" style={{ color: 'var(--accent-gold)' }}>{formatNaira(order.total)}</p>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <p className="text-xs mt-3 mb-2" style={{ color: 'var(--text-muted)' }}>📞 {order.phone}</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>📦 {order.items} item(s)</p>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button className="flex-1 py-2 rounded-lg text-xs font-bold"
                        style={{ background: 'var(--accent-gold)', color: '#000' }}>
                        Mark Paid
                      </button>
                    )}
                    {order.status === 'paid' && (
                      <button className="flex-1 py-2 rounded-lg text-xs font-bold"
                        style={{ background: 'var(--accent-cyan)', color: '#000' }}>
                        Mark Shipped
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button className="flex-1 py-2 rounded-lg text-xs font-bold"
                        style={{ background: '#6dc878', color: '#000' }}>
                        Mark Delivered
                      </button>
                    )}
                    <button className="px-4 py-2 rounded-lg text-xs font-semibold"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                      WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
