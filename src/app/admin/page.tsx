'use client';

import { useRouter } from 'next/navigation';

const STATS = [
  { label: 'Revenue', value: '₦12.4M', change: '+18%', icon: '💰', positive: true },
  { label: 'Orders', value: '247', change: '+12%', icon: '📦', positive: true },
  { label: 'Products', value: '84', change: '+3', icon: '🛍️', positive: true },
  { label: 'Customers', value: '1,203', change: '+9%', icon: '👥', positive: true },
];

const RECENT_ORDERS = [
  { id: 'ORD-247', customer: 'Adaeze N.', total: 1_850_000, status: 'pending', time: '2m ago' },
  { id: 'ORD-246', customer: 'Emeka O.', total: 380_000, status: 'paid', time: '15m ago' },
  { id: 'ORD-245', customer: 'Fatima A.', total: 2_400_000, status: 'processing', time: '1h ago' },
  { id: 'ORD-244', customer: 'Chidi I.', total: 220_000, status: 'shipped', time: '3h ago' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:    { bg: 'rgba(201,168,76,0.15)',  color: 'var(--accent-gold)' },
  paid:       { bg: 'rgba(0,212,255,0.15)',   color: 'var(--accent-cyan)' },
  processing: { bg: 'rgba(0,212,255,0.15)',   color: 'var(--accent-cyan)' },
  shipped:    { bg: 'rgba(100,200,100,0.15)', color: '#6dc878' },
  delivered:  { bg: 'rgba(100,200,100,0.15)', color: '#6dc878' },
  cancelled:  { bg: 'rgba(255,80,80,0.15)',   color: '#ff5050' },
};

const QUICK_ACTIONS = [
  { icon: '➕', label: 'Add Product', path: '/admin/products/new' },
  { icon: '📦', label: 'Orders', path: '/admin/orders' },
  { icon: '🛍️', label: 'Products', path: '/admin/products' },
  { icon: '👥', label: 'Customers', path: '/admin/customers' },
  { icon: '📊', label: 'Analytics', path: '/admin/analytics' },
  { icon: '⚙️', label: 'Settings', path: '/admin/settings' },
];

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen pb-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
          <h1 className="text-base font-bold gold-shimmer">LUXE TECH</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            🔔
          </button>
          <button onClick={() => router.push('/')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--accent-gold)', border: '1px solid var(--border-glow)' }}>
            Store →
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 mt-4">
        {STATS.map(stat => (
          <div key={stat.label} className="card-luxury p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                style={{
                  background: stat.positive ? 'rgba(100,200,100,0.15)' : 'rgba(255,80,80,0.15)',
                  color: stat.positive ? '#6dc878' : '#ff5050',
                }}>
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Quick Actions</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map(action => (
            <button key={action.label} onClick={() => router.push(action.path)}
              className="card-luxury flex flex-col items-center gap-1.5 py-3 px-2">
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs text-center leading-tight" style={{ color: 'var(--text-secondary)' }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Live Orders</p>
          <button className="text-xs" style={{ color: 'var(--accent-gold)' }}
            onClick={() => router.push('/admin/orders')}>View all</button>
        </div>
        <div className="flex flex-col gap-2">
          {RECENT_ORDERS.map(order => {
            const s = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending;
            return (
              <div key={order.id} className="card-luxury px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{order.id}</p>
                    <span className="px-1.5 py-0.5 rounded text-xs font-semibold"
                      style={{ background: s.bg, color: s.color, textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                    {order.customer} · {order.time}
                  </p>
                </div>
                <p className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--accent-gold)' }}>
                  {formatNaira(order.total)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
