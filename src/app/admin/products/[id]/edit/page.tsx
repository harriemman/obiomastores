'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import { updateProduct } from '@/lib/api';

const CATEGORIES = ['phones', 'laptops', 'audio', 'gaming', 'accessories', 'tablets'];

interface ProductForm {
  title: string;
  brand: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  categoryId: string;
  description: string;
  status: 'active' | 'draft';
  tags: string;
}

const EMPTY: ProductForm = {
  title: '', brand: '', price: '', compareAtPrice: '',
  stock: '', categoryId: '', description: '', status: 'active', tags: '',
};

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { product, loading: productLoading } = useProduct(id);

  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Pre-populate form once product loads
  useEffect(() => {
    if (!product) return;
    setForm({
      title: product.title ?? '',
      brand: product.brand ?? '',
      price: product.price != null ? String(product.price) : '',
      compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : '',
      stock: product.stock != null ? String(product.stock) : '',
      categoryId: product.category?.id ?? '',
      description: product.description ?? '',
      status: product.status === 'active' || product.status === 'draft' ? product.status : 'active',
      tags: product.tags?.join(', ') ?? '',
    });
  }, [product]);

  const set = (field: keyof ProductForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.title || !form.price || !form.stock) {
      setError('Title, price, and stock are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateProduct(id, {
        title: form.title,
        brand: form.brand || undefined,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        stock: Number(form.stock),
        description: form.description || undefined,
        status: form.status,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });
      router.push('/admin/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({
    label, field, placeholder, type = 'text',
  }: { label: string; field: keyof ProductForm; placeholder?: string; type?: string }) => (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[field] as string}
        onChange={set(field)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', caretColor: 'var(--accent-gold)' }}
      />
    </div>
  );

  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
        Loading product…
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-36" style={{ background: 'var(--bg-primary)' }}>
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => router.back()} className="text-xl">←</button>
        <span className="font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>Edit Product</span>
        <span className="text-xs px-2 py-0.5 rounded"
          style={{ background: form.status === 'active' ? 'rgba(100,200,100,0.15)' : 'rgba(201,168,76,0.15)', color: form.status === 'active' ? '#6dc878' : 'var(--accent-gold)' }}>
          {form.status}
        </span>
      </header>

      <div className="px-4 mt-4 flex flex-col gap-4">
        <Field label="Product Title *" field="title" placeholder="e.g. iPhone 15 Pro Max" />
        <Field label="Brand" field="brand" placeholder="e.g. Apple" />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₦) *" field="price" placeholder="1850000" type="number" />
          <Field label="Compare At Price (₦)" field="compareAtPrice" placeholder="Optional" type="number" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Stock *" field="stock" placeholder="0" type="number" />
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Category</label>
            <select value={form.categoryId} onChange={set('categoryId')}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: form.categoryId ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
          <textarea
            rows={4}
            placeholder="Product description..."
            value={form.description}
            onChange={set('description')}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', caretColor: 'var(--accent-gold)' }}
          />
        </div>

        <Field label="Tags (comma separated)" field="tags" placeholder="flagship, 5g, new" />

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Status</label>
          <div className="flex gap-2">
            {(['active', 'draft'] as const).map(s => (
              <button key={s} onClick={() => setForm(prev => ({ ...prev, status: s }))}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize"
                style={{
                  background: form.status === s ? (s === 'active' ? 'rgba(100,200,100,0.15)' : 'rgba(201,168,76,0.15)') : 'var(--bg-card)',
                  color: form.status === s ? (s === 'active' ? '#6dc878' : 'var(--accent-gold)') : 'var(--text-muted)',
                  border: `1px solid ${form.status === s ? (s === 'active' ? 'rgba(100,200,100,0.3)' : 'var(--border-glow)') : 'var(--border-subtle)'}`,
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(255,80,80,0.1)', color: '#ff5050', border: '1px solid rgba(255,80,80,0.2)' }}>
            ⚠️ {error}
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 flex gap-3"
        style={{ background: 'rgba(3,3,3,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={() => router.back()}
          className="flex-1 py-3.5 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex-[2] py-3.5 rounded-xl text-sm font-bold transition-opacity"
          style={{ background: 'var(--accent-gold)', color: '#000', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
