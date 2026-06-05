'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_PRODUCTS = [
  { id: '1', title: 'iPhone 15 Pro Max', price: 1_850_000, stock: 12, status: 'active', image: '📱', brand: 'Apple' },
  { id: '2', title: 'MacBook Pro M3', price: 2_400_000, stock: 5, status: 'active', image: '💻', brand: 'Apple' },
  { id: '3', title: 'Sony WH-1000XM5', price: 380_000, stock: 24, status: 'active', image: '🎧', brand: 'Sony' },
  { id: '4', title: 'Samsung Galaxy S24', price: 1_200_000, stock: 0, status: 'draft', image: '📱', brand: 'Samsung' },
  { id: '5', title: 'iPad Pro M4', price: 1_650_000, stock: 8, status: 'active', image: '📱', brand: 'Apple' },
  { id: '6', title: 'AirPods Pro 2', price: 220_000, stock: 30, status: 'active', image: '🎧', brand: 'Apple' },
];

const STATUS_CHIP: Record<string, { bg: string; color: string }> = {
  active:   { bg: 'rgba(100,200,100,0.15)', color: '#6dc878' },
  draft:    { bg: 'rgba(201,168,76,0.15)',  color: 'var(--accent-gold)' },
  archived: { bg: 'rgba(255,80,80,0.15)',   color: '#ff5050' },
};

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = MOCK_PRODUCTS.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen pb-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => router.back()} className="text-xl">←</button>
        <span className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>Products</span>
        <button onClick={() => router.push('/admin/products/new')}
          className="px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'var(--accent-gold)', color: '#000' }}>
          + Add
        </button>
      </header>

      {/* Search */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <span>🔍</span>
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-gold)' }}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-3 px-4 mt-3">
        {[
          { label: 'Total', value: MOCK_PRODUCTS.length },
          { label: 'Active', value: MOCK_PRODUCTS.filter(p => p.status === 'active').length },
          { label: 'Out of Stock', value: MOCK_PRODUCTS.filter(p => p.stock === 0).length },
        ].map(s => (
          <div key={s.label} className="flex-1 text-center rounded-xl py-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <p className="text-base font-bold" style={{ color: 'var(--accent-gold)' }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Product List */}
      <div className="px-4 mt-4 flex flex-col gap-2">
        {filtered.map(product => {
          const s = STATUS_CHIP[product.status] ?? STATUS_CHIP.draft;
          return (
            <div key={product.id} className="card-luxury px-4 py-3 flex items-center gap-3">
              <span className="text-3xl flex-shrink-0">{product.image}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {product.title}
                  </p>
                  <span className="px-1.5 py-0.5 rounded text-xs font-semibold flex-shrink-0"
                    style={{ background: s.bg, color: s.color, textTransform: 'capitalize' }}>
                    {product.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-xs font-bold" style={{ color: 'var(--accent-gold)' }}>{formatNaira(product.price)}</p>
                  <p className="text-xs" style={{ color: product.stock === 0 ? '#ff5050' : 'var(--text-muted)' }}>
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button className="px-3 py-1 rounded-lg text-xs font-semibold"
                  onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                  style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--accent-gold)', border: '1px solid var(--border-glow)' }}>
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
