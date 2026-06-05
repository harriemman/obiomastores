'use client';

import { useRouter } from 'next/navigation';
import { useTelegram } from './telegram-provider';
import { useCartStore } from '@/store/cart';
import { useProducts } from '@/hooks/useProducts';

const CATEGORIES = [
  { id: 'phones', label: 'Phones', icon: '📱' },
  { id: 'laptops', label: 'Laptops', icon: '💻' },
  { id: 'audio', label: 'Audio', icon: '🎧' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'accessories', label: 'Accessories', icon: '⌚' },
];

const FEATURED = [
  { id: '1', title: 'iPhone 15 Pro Max', price: 1_850_000, image: '📱', badge: 'HOT' },
  { id: '2', title: 'MacBook Pro M3', price: 2_400_000, image: '💻', badge: 'NEW' },
  { id: '3', title: 'Sony WH-1000XM5', price: 380_000, image: '🎧', badge: null },
  { id: '4', title: 'Samsung Galaxy S24', price: 1_200_000, image: '📱', badge: 'SALE' },
];

function formatNaira(amount: number) {
  return '₦' + amount.toLocaleString('en-NG');
}

export default function HomePage() {
  const { user } = useTelegram();
  const router = useRouter();
  const cartCount = useCartStore(s => s.count());

  const { products: liveProducts, loading: productsLoading } = useProducts({ sort: 'bestSelling' });
  const displayProducts = liveProducts.length > 0 ? liveProducts.slice(0, 4).map(p => ({
    id: p.id,
    title: p.title,
    price: Number(p.price),
    image: p.images?.[0] || '📱',
    badge: p.salesCount > 50 ? 'HOT' : p.compareAtPrice ? 'SALE' : null,
  })) : FEATURED;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(3,3,3,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Welcome back</p>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            {user?.first_name ?? 'Guest'} 👋
          </p>
        </div>
        <span className="text-lg font-bold gold-shimmer">LUXE TECH</span>
        <button className="relative p-2 rounded-full" style={{ background: 'var(--bg-card)' }}
          onClick={() => router.push('/cart')}>
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
              style={{ background: 'var(--accent-gold)', color: '#000' }}>{cartCount}</span>
          )}
        </button>
      </header>

      {/* Hero Banner */}
      <div className="mx-4 mt-4 rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D0D12 0%, #1a1400 50%, #0D0D12 100%)', border: '1px solid var(--border-glow)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(circle at 70% 50%, var(--accent-gold), transparent 60%)' }} />
        <p className="text-xs mb-1" style={{ color: 'var(--accent-gold)' }}>EXCLUSIVE DEALS</p>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Premium Tech</h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Top brands, best prices</p>
        <button className="px-5 py-2 rounded-full text-sm font-semibold glow-gold"
          style={{ background: 'var(--accent-gold)', color: '#000' }}>
          Shop Now →
        </button>
      </div>

      {/* Categories */}
      <div className="mt-6 px-4">
        <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Categories</p>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id}
              className="flex flex-col items-center gap-1 flex-shrink-0 px-4 py-3 rounded-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', minWidth: '72px' }}>
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mt-6 px-4 pb-24">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Featured</p>
          <button className="text-xs" style={{ color: 'var(--accent-gold)' }}>See all</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {displayProducts.map(product => (
            <div key={product.id} className="card-luxury p-3 cursor-pointer"
              onClick={() => router.push(`/product/${product.id}`)}>
              {product.badge && (
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2"
                  style={{ background: product.badge === 'SALE' ? 'var(--accent-cyan)' : 'var(--accent-gold)', color: '#000' }}>
                  {product.badge}
                </span>
              )}
              <div className="text-4xl text-center my-3">{product.image}</div>
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{product.title}</p>
              <p className="text-sm font-bold mt-1" style={{ color: 'var(--accent-gold)' }}>{formatNaira(product.price)}</p>
              <button className="mt-2 w-full py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--accent-gold)', border: '1px solid var(--border-glow)' }}
                onClick={e => { e.stopPropagation(); router.push(`/product/${product.id}`); }}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 flex justify-around items-center py-3"
        style={{ background: 'rgba(13,13,18,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-subtle)' }}>
        {[
          { icon: '🏠', label: 'Home', path: '/', active: true },
          { icon: '🔍', label: 'Search', path: '/search', active: false },
          { icon: '🛒', label: 'Cart', path: '/cart', active: false },
          { icon: '❤️', label: 'Wishlist', path: '/wishlist', active: false },
          { icon: '👤', label: 'Profile', path: '/profile', active: false },
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
