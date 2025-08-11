'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function OrdersPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ customerId: '', productId: '', qty: 1 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadAll() {
    try {
      const [cRes, pRes, oRes] = await Promise.all([
        fetch(`${API_BASE}/customers`, { cache: 'no-store' }),
        fetch(`${API_BASE}/products`, { cache: 'no-store' }),
        fetch(`${API_BASE}/orders`, { cache: 'no-store' }),
      ]);
      setCustomers(await cRes.json());
      setProducts(await pRes.json());
      setOrders(await oRes.json());
    } catch { setError('Failed to load data'); }
  }
  useEffect(() => { loadAll(); }, []);

  async function onSubmit(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const body = {
        customerId: Number(form.customerId),
        items: [{ productId: Number(form.productId), qty: Number(form.qty) }],
      };
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Request failed');
      setForm({ customerId: '', productId: '', qty: 1 });
      await loadAll();
    } catch { setError('Failed to create order'); } finally { setSaving(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Orders</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-[--brand-blue] focus:border-[--brand-blue]"
            value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} required>
            <option value="">Select customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
          </select>

          <select className="rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-[--brand-blue] focus:border-[--brand-blue]"
            value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required>
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — ${(p.priceCents/100).toFixed(2)}
              </option>
            ))}
          </select>

          <input className="rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-[--brand-blue] focus:border-[--brand-blue]"
            type="number" min="1" value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })} required />
        </div>

        <button type="submit" className="rounded-xl px-4 py-2 text-white bg-[--brand-blue] hover:brightness-110 disabled:opacity-50" disabled={saving}>
          {saving ? 'Creating…' : 'Create Order'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      <div>
        <h2 className="font-medium mb-3">Recent Orders</h2>
        <ul className="space-y-3">
          {orders.map(o => (
            <li key={o.id} className="rounded-xl border border-slate-200 p-3">
              <div className="font-medium">
                Order #{o.id} — ${(o.totalCents/100).toFixed(2)} — {o.status}
              </div>
              <div className="text-sm text-slate-600">
                {o.customer?.name} ({o.customer?.email})
              </div>
              <ul className="mt-2 text-sm list-disc pl-5">
                {o.items?.map(it => (
                  <li key={it.id}>{it.qty} × {it.product?.name}</li>
                ))}
              </ul>
            </li>
          ))}
          {orders.length === 0 && <li className="text-slate-500">No orders yet.</li>}
        </ul>
      </div>
    </div>
  );
}
