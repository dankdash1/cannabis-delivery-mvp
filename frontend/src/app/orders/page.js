'use client';
import { useEffect, useMemo, useState } from 'react';
import Pager from '../../components/Pager';
import { API_BASE } from '../../lib/api';
const API_UTIL = API_BASE + '/util/orders';

export default function OrdersPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [q, setQ] = useState('');

  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', qty: 1 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadLists() {
    try {
      const [cRes, pRes] = await Promise.all([
        fetch(API_BASE + '/customers', { cache: 'no-store' }),
        fetch(API_BASE + '/products', { cache: 'no-store' }),
      ]);
      setCustomers(await cRes.json());
      setProducts(await pRes.json());
    } catch { setError('Failed to load lists'); }
  }

  async function loadOrders(p = page, query = q) {
    try {
      const url = new URL(API_UTIL);
      url.searchParams.set('page', String(p));
      url.searchParams.set('pageSize', String(pageSize));
      if (query) url.searchParams.set('q', query);
      const res = await fetch(url.toString(), { cache: 'no-store' });
      const data = await res.json();
      setOrders(data.items || []); setTotal(data.total || 0);
    } catch { setError('Failed to load orders'); }
  }

  useEffect(() => { loadLists(); loadOrders(1, q); }, []);
  useEffect(() => { loadOrders(page, q); }, [page]);

  function addItem() { setItems(prev => [...prev, { productId: '', qty: 1 }]); }
  function removeItem(idx) { setItems(prev => prev.length > 1 ? prev.filter((_,i)=>i!==idx) : prev); }
  function updateItem(idx, field, value) { setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it)); }

  const totalCents = useMemo(() => {
    return items.reduce((sum, it) => {
      const p = products.find(pr => pr.id === Number(it.productId));
      const line = p ? (p.priceCents * Number(it.qty || 0)) : 0;
      return sum + line;
    }, 0);
  }, [items, products]);

  async function onSubmit(e) {
    e.preventDefault(); setSaving(true); setError(''); setNotice('');
    try {
      const cleaned = items.filter(it => it.productId && Number(it.qty) > 0).map(it => ({ productId: Number(it.productId), qty: Number(it.qty) }));
      if (!customerId || cleaned.length === 0) { setError('Choose a customer and add at least one item'); return; }
      const res = await fetch(API_BASE + '/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId: Number(customerId), items: cleaned }) });
      if (!res.ok) { setError('Failed to create order'); return; }
      setNotice('Order created'); setCustomerId(''); setItems([{ productId: '', qty: 1 }]); setPage(1); await loadOrders(1, q);
    } catch { setError('Failed to create order'); } finally { setSaving(false); }
  }

  return (
    <div className="card p-6 space-y-6">
      <h1>Orders</h1>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input className="input md:w-80" placeholder="Search customer or product…" value={q} onChange={(e)=>{ setQ(e.target.value); setPage(1); loadOrders(1, e.target.value); }} />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <select className="select w-full" value={customerId} onChange={(e)=>setCustomerId(e.target.value)} required>
          <option value="">Select customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
        </select>

        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <select className="select" value={it.productId} onChange={(e)=>updateItem(idx, 'productId', e.target.value)} required>
                <option value="">Select product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — ${ (p.priceCents/100).toFixed(2) }</option>)}
              </select>
              <input className="input" type="number" min="1" value={it.qty} onChange={(e)=>updateItem(idx, 'qty', e.target.value)} required />
              <div className="flex gap-2">
                {items.length > 1 && <button type="button" onClick={()=>removeItem(idx)} className="px-3 py-2 rounded-lg bg-slate-100">Remove</button>}
                {idx === items.length - 1 && <button type="button" onClick={addItem} className="px-3 py-2 rounded-lg bg-slate-100">Add item</button>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">Total</div>
          <div className="font-semibold text-lg">${ (totalCents/100).toFixed(2) }</div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Creating…' : 'Create Order'}</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {notice && <p className="text-green-700 text-sm">{notice}</p>}
      </form>

      <div>
        <h2 className="mb-3">Recent Orders</h2>
        <ul className="space-y-3">
          {orders.map(o => (
            <li key={o.id} className="border rounded-xl p-3">
              <div className="font-medium">Order #{o.id} — ${ (o.totalCents/100).toFixed(2) } — {o.status}</div>
              <div className="text-sm text-slate-600">{o.customer?.name} ({o.customer?.email})</div>
              <ul className="mt-2 text-sm list-disc pl-5">
                {o.items?.map(it => <li key={it.id}>{it.qty} × {it.product?.name}</li>)}
              </ul>
            </li>
          ))}
          {orders.length === 0 && <li className="text-slate-500">No orders on this page.</li>}
        </ul>
        <Pager page={page} pageSize={pageSize} total={total} onChange={setPage} />
      </div>
    </div>
  );
}
