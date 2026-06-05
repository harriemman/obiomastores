'use client';

import { useRouter } from 'next/navigation';
import { useTelegram } from '../telegram-provider';
import { useCartStore } from '@/store/cart';

const MOCK_ORDERS = [
  { id: 'ORD-001', date: '2025-05-20', status: 'delivered', total: 1_850_000, items: 1 },
  { id: 'ORD-002', date: '2025-05-15', status: 'shipped', total: 380_000, items: 1 },
  { id: 'ORD-003', date: '2025-05-10', status: 'processing', total: 2_400_000, items: 1 },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:    { bg: 'rgba(201,168,76,0.15)',   color: 'var(--accent-gold)', label: 'Pending' },
  paid:       { bg: 'rgba(0,212,255,0.15)',    color: 'var(--accent-cyan)', label: 'Paid' },
  processing: { bg: 'rgba(0,212,255,0.15)',    color: 'var(--accent-cyan)', label: 'Processing' },
  shipped:    { bg: 'rgba(100,200,100,0.15)',  color: '#6dc878',            label: 'Shipped' },
  delivered:  { bg: 'rgba(100,200,100,0.15)',  color: '#6dc878',            label: 'Delivered' },
  cancelled:  { bg: 'rgba(255,80,80,0.15)',    color: '#ff5050',            label: 'Cancelled' },
};

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useTelegram();
  const cartCount = useCartStore(s => s.count());

  const MENU = [
    { icon: '📦', label: 'My Orders', sub: `${MOCK_ORDERS.length} orders`, path: '/profile/orders' },
    { icon: '❤️', label: 'Wishlist', sub: 'Saved items', path: '/wishlist' },
    { icon: '📍', label: 'Addresses', sub: 'Delivery locations', path: '/profile/addresses' },
    { icon: '💬', label: 'Support', sub: 'Chat with us', path: '/support' },
    { icon: '⚙️', label: 'Settings', sub: 'Preferences & account', path: '/profile/settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="px-4 pt-6 pb-4"
        style={{ background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-primary) 100%)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, var(--accent-gold-dim), var(--accent-gold))', color: '#000' }}>
            {user?.first_name?.[0] ?? '?'}
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {user?.first_name ?? 'Guest'} {user?.last_name ?? ''}
            </h1>
            {user?.username && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>@{user.username}</p>
            )}
            <p className="text-xs mt-1" style={{ color: 'var(--accent-gold)' }}>⭐ Loyalty: 0 pts</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Orders', value: MOCK_ORDERS.length },
            { label: 'Cart', value: cartCount },
            { label: 'Points', value: 0 },
          ].map(stat => (
            <div key={stat.label} className="text-center rounded-xl py-2"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-lg font-bold" style={{ color: 'var(--accent-gold)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Recent Orders</p>
          <button className="text-xs" style={{ color: 'var(--accent-gold)' }}
            onClick={() => router.push('/profile/orders')}>See all</button>
        </div>
        <div className="flex flex-col gap-2">
          {MOCK_ORDERS.slice(0, 2).map(order => {
            const s = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending;
            return (
              <div key={order.id} className="card-luxury px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{order.id}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{order.date} · {order.items} item</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  <p className="text-xs font-bold" style={{ color: 'var(--accent-gold)' }}>{formatNaira(order.total)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 mt-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Account</p>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
          {MENU.map((item, i) => (
            <button key={item.label} onClick={() => router.push(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
              style={{
                background: 'var(--bg-card)',
                borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
              }}>
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-3"
        style={{ background: 'rgba(13,13,18,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-subtle)' }}>
        {[
          { icon: '🏠', label: 'Home', path: '/', active: false },
          { icon: '🔍', label: 'Search', path: '/search', active: false },
          { icon: '🛒', label: 'Cart', path: '/cart', active: false },
          { icon: '❤️', label: 'Wishlist', path: '/wishlist', active: false },
          { icon: '👤', label: 'Profile', path: '/profile', active: true },
        ].map(item => (
          <button key={item.label} className="flex flex-col items-center gap-0.5"
            onClick={() => router.push(item.path)}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs" style={{ color: item.active ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
