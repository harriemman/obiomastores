'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useState } from 'react';
import { useProduct } from '@/hooks/useProducts';

// Placeholder — will be replaced by API fetch
const PRODUCTS: Record<string, {
  id: string; title: string; price: number; compareAt?: number;
  image: string; badge?: string; brand: string; description: string;
  specs: Record<string, string>; images: string[];
}> = {
  '1': {
    id: '1', title: 'iPhone 15 Pro Max', price: 1_850_000, compareAt: 2_100_000,
    image: '📱', badge: 'HOT', brand: 'Apple',
    description: 'The most powerful iPhone ever. Titanium design, A17 Pro chip, and a pro camera system that shoots 4K120fps ProRes video.',
    specs: { Chip: 'A17 Pro', Storage: '256GB', Display: '6.7" Super Retina XDR', Battery: '4422 mAh', OS: 'iOS 17' },
    images: ['📱', '📱', '📱'],
  },
  '2': {
    id: '2', title: 'MacBook Pro M3', price: 2_400_000,
    image: '💻', badge: 'NEW', brand: 'Apple',
    description: 'M3 chip delivers up to 35% faster CPU performance. 14‑inch Liquid Retina XDR display.',
    specs: { Chip: 'Apple M3', RAM: '18GB', Storage: '512GB SSD', Display: '14" Liquid Retina XDR', Battery: '22hrs' },
    images: ['💻', '💻', '💻'],
  },
  '3': {
    id: '3', title: 'Sony WH-1000XM5', price: 380_000,
    image: '🎧', brand: 'Sony',
    description: 'Industry-leading noise cancelling headphones with up to 30-hour battery life.',
    specs: { 'Driver Size': '30mm', 'Battery': '30hrs', 'ANC': 'Yes', 'Connectivity': 'Bluetooth 5.2', Weight: '250g' },
    images: ['🎧', '🎧', '🎧'],
  },
  '4': {
    id: '4', title: 'Samsung Galaxy S24', price: 1_200_000,
    image: '📱', badge: 'SALE', brand: 'Samsung',
    description: 'Galaxy AI is here. The Galaxy S24 brings Circle to Search, Live Translate and more.',
    specs: { Chip: 'Snapdragon 8 Gen 3', RAM: '8GB', Storage: '256GB', Display: '6.2" Dynamic AMOLED', Battery: '4000 mAh' },
    images: ['📱', '📱', '📱'],
  },
};

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const add = useCartStore(s => s.add);
  const { toggle, has } = useWishlistStore();
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const { product: apiProduct, loading: apiLoading } = useProduct(id);

  const productData = apiProduct ? {
    id: apiProduct.id,
    title: apiProduct.title,
    price: Number(apiProduct.price),
    compareAt: apiProduct.compareAtPrice ? Number(apiProduct.compareAtPrice) : undefined,
    image: apiProduct.images?.[0] || '📱',
    badge: apiProduct.salesCount > 50 ? 'HOT' as const : apiProduct.compareAtPrice ? 'SALE' as const : undefined,
    brand: apiProduct.brand || 'Unknown',
    description: apiProduct.description || '',
    specs: apiProduct.specifications as Record<string, string>,
    images: apiProduct.images?.length ? apiProduct.images : ['📱', '📱', '📱'],
  } : PRODUCTS[id];
  if (!productData && !apiLoading) return <div style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }} className='flex items-center justify-center h-screen'>Product not found</div>;
  if (!productData) return <div style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }} className='flex items-center justify-center h-screen'>Loading...</div>;
  const product = productData;

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : null;

  const handleAddToCart = () => {
    add({ id: product.id, title: product.title, price: product.price, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(3,3,3,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => router.back()} className="text-xl">←</button>
        <span className="font-semibold text-sm truncate flex-1" style={{ color: 'var(--text-primary)' }}>
          {product.title}
        </span>
      </header>

      {/* Image carousel */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden flex flex-col items-center justify-center py-10"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', minHeight: 220 }}>
        <span className="text-8xl">{product.images[activeImg]}</span>
        <div className="flex gap-2 mt-4">
          {product.images.map((_, i) => (
            <button key={i} onClick={() => setActiveImg(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{ background: i === activeImg ? 'var(--accent-gold)' : 'var(--border-subtle)' }} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 mt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs" style={{ color: 'var(--accent-cyan)' }}>{product.brand}</p>
            <h1 className="text-lg font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{product.title}</h1>
          </div>
          {product.badge && (
            <span className="px-2 py-0.5 rounded text-xs font-bold flex-shrink-0"
              style={{ background: product.badge === 'SALE' ? 'var(--accent-cyan)' : 'var(--accent-gold)', color: '#000' }}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>
            {formatNaira(product.price)}
          </span>
          {product.compareAt && (
            <>
              <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
                {formatNaira(product.compareAt)}
              </span>
              <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                style={{ background: 'rgba(0,212,255,0.15)', color: 'var(--accent-cyan)' }}>
                -{discount}%
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {product.description}
        </p>

        {/* Specs */}
        <div className="mt-5 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>Specifications</p>
          {Object.entries(product.specs).map(([key, val], i) => (
            <div key={key} className="flex justify-between px-4 py-2.5 text-sm"
              style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{key}</span>
              <span style={{ color: 'var(--text-primary)' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 flex gap-3"
        style={{ background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={() => toggle({ id: product.id, title: product.title, price: product.price, image: product.image, brand: product.brand })}
          className="flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: has(product.id) ? 'rgba(255,80,80,0.1)' : 'rgba(201,168,76,0.1)',
            color: has(product.id) ? '#ff5050' : 'var(--accent-gold)',
            border: `1px solid ${has(product.id) ? 'rgba(255,80,80,0.3)' : 'var(--border-glow)'}`,
          }}>
          {has(product.id) ? '❤️ Saved' : '🤍 Wishlist'}
        </button>
        <button onClick={handleAddToCart}
          className="flex-2 flex-[2] py-3.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: added ? 'rgba(0,212,255,0.2)' : 'var(--accent-gold)',
            color: added ? 'var(--accent-cyan)' : '#000',
            border: added ? '1px solid var(--accent-cyan)' : 'none'
          }}>
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
