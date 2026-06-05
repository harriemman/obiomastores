'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';

const ALL_PRODUCTS = [
  { id: '1', title: 'iPhone 15 Pro Max', price: 1_850_000, image: '📱', badge: 'HOT', brand: 'Apple', category: 'phones' },
  { id: '2', title: 'MacBook Pro M3', price: 2_400_000, image: '💻', badge: 'NEW', brand: 'Apple', category: 'laptops' },
  { id: '3', title: 'Sony WH-1000XM5', price: 380_000, image: '🎧', badge: null, brand: 'Sony', category: 'audio' },
  { id: '4', title: 'Samsung Galaxy S24', price: 1_200_000, image: '📱', badge: 'SALE', brand: 'Samsung', category: 'phones' },
  { id: '5', title: 'iPad Pro M4', price: 1_650_000, image: '📱', badge: null, brand: 'Apple', category: 'tablets' },
  { id: '6', title: 'AirPods Pro 2', price: 220_000, image: '🎧', badge: null, brand: 'Apple', category: 'audio' },
  { id: '7', title: 'PS5 Console', price: 780_000, image: '🎮', badge: 'HOT', brand: 'Sony', category: 'gaming' },
  { id: '8', title: 'Apple Watch Series 9', price: 450_000, image: '⌚', badge: null, brand: 'Apple', category: 'accessories' },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'priceAsc', label: 'Price ↑' },
  { id: 'priceDesc', label: 'Price ↓' },
  { id: 'bestSelling', label: 'Best Selling' },
];

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

export default function SearchPage() {
  const router = useRouter();
  const add = useCartStore(s => s.add);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [, startTransition] = useTransition();

  const filtered = ALL_PRODUCTS.filter(p =>
    !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => {
    if (sort === 'priceAsc') return a.price - b.price;
    if (sort === 'priceDesc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen pb-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Search Header */}
      <div className="sticky top-0 z-50 px-4 pt-4 pb-3"
        style={{ background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <span className="text-lg">🔍</span>
          <input
            autoFocus
            type="search"
            placeholder="Search products, brands..."
            value={query}
            onChange={e => startTransition(() => setQuery(e.target.value))}
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-gold)' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}>✕</button>
          )}
        </div>

        {/* Sort chips */}
        <div className="flex gap-2 mt-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setSort(opt.id)}
              className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 transition-all"
              style={{
                background: sort === opt.id ? 'var(--accent-gold)' : 'var(--bg-card)',
                color: sort === opt.id ? '#000' : 'var(--text-muted)',
                border: `1px solid ${sort === opt.id ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 py-2">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}{query ? ` for "${query}"` : ''}
        </p>
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-20">
          <span className="text-5xl">🔍</span>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {filtered.map(product => (
            <div key={product.id} className="card-luxury p-3 cursor-pointer"
              onClick={() => router.push(`/product/${product.id}`)}>
              {product.badge && (
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2"
                  style={{ background: product.badge === 'SALE' ? 'var(--accent-cyan)' : 'var(--accent-gold)', color: '#000' }}>
                  {product.badge}
                </span>
              )}
              <div className="text-4xl text-center my-2">{product.image}</div>
              <p className="text-xs" style={{ color: 'var(--accent-cyan)' }}>{product.brand}</p>
              <p className="text-sm font-medium truncate mt-0.5" style={{ color: 'var(--text-primary)' }}>{product.title}</p>
              <p className="text-sm font-bold mt-1" style={{ color: 'var(--accent-gold)' }}>{formatNaira(product.price)}</p>
              <button
                onClick={e => {
                  e.stopPropagation();
                  add({ id: product.id, title: product.title, price: product.price, image: product.image });
                }}
                className="mt-2 w-full py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--accent-gold)', border: '1px solid var(--border-glow)' }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
