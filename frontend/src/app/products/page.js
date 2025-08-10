'use client';

import { useEffect, useState } from 'react';
const API = 'http://localhost:4002/products';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      const res = await fetch(API, { cache: 'no-store' });
      setProducts(await res.json());
    } catch {
      setError('Failed to load products');
    }
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const priceCents = Math.round(parseFloat(form.price || '0') * 100);
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, priceCents })
      });
      if (!res.ok) throw new Error('Bad response');
      setForm({ name: '', price: '' });
      await load();
    } catch {
      setError('Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Products</h1>

      <form onSubmit={onSubmit} className="space-y-3 bg-white rounded-2xl shadow p-4">
        <input
          className="w-full border rounded-xl p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full border rounded-xl p-2"
          placeholder="Price (USD)"
          type="number" step="0.01" min="0"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Add Product'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="font-semibold mb-3">Current Products</h2>
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">${(p.priceCents/100).toFixed(2)}</div>
              </div>
              {!p.active && <span className="text-xs px-2 py-1 rounded bg-gray-200">inactive</span>}
            </li>
          ))}
          {products.length === 0 && <li className="text-gray-500">No products yet.</li>}
        </ul>
      </div>
    </div>
  );
}
