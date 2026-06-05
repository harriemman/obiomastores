'use client';

import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

export default function WishlistPage() {
  const router = useRouter();
  const { items, remove } = useWishlistStore();
  const addToCart = useCartStore(s => s.add);

  if (items.length === 0) return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4 pb-24"
      style={{ background: 'var(--bg-primary)' }}>
      <span className="text-6xl">❤️</span>
      <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No saved items</p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tap ❤️ on any product to save it</p>
      <button onClick={() => router.push('/')}
        className="mt-2 px-6 py-3 rounded-full font-semibold text-sm"
        style={{ background: 'var(--accent-gold)', color: '#000' }}>
        Browse Products
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(3,3,3,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => router.back()} className="text-xl">←</button>
        <span className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
          Wishlist <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>({items.length})</span>
        </span>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4 mt-4">
        {items.map(item => (
          <div key={item.id} className="card-luxury p-3 relative">
            {/* Remove */}
            <button onClick={() => remove(item.id)}
              className="absolute top-2 right-2 text-sm"
              style={{ color: 'var(--text-muted)' }}>✕</button>

            {/* Product */}
            <div className="text-4xl text-center my-3 cursor-pointer"
              onClick={() => router.push(`/product/${item.id}`)}>
              {item.image}
            </div>
            {item.brand && (
              <p className="text-xs" style={{ color: 'var(--accent-cyan)' }}>{item.brand}</p>
            )}
            <p className="text-sm font-medium truncate mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: 'var(--accent-gold)' }}>
              {formatNaira(item.price)}
            </p>
            <button
              onClick={() => {
                addToCart({ id: item.id, title: item.title, price: item.price, image: item.image });
                remove(item.id);
                router.push('/cart');
              }}
              className="mt-2 w-full py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: 'var(--accent-gold)', color: '#000' }}>
              Move to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
