'use client';
import { useEffect, useState } from 'react';
import Pager from '../../components/Pager';
import { API_BASE } from '../../lib/api';
const API = API_BASE + '/products';
const API_UTIL = API_BASE + '/util/products';

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [q, setQ] = useState('');

  const [form, setForm] = useState({ name: '', price: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '' });

  async function load(p = page, query = q) {
    setError('');
    const url = new URL(API_UTIL);
    url.searchParams.set('page', String(p));
    url.searchParams.set('pageSize', String(pageSize));
    if (query) url.searchParams.set('q', query);
    try {
      const res = await fetch(url.toString(), { cache: 'no-store' });
      const data = await res.json();
      setItems(data.items || []); setTotal(data.total || 0);
    } catch { setError('Failed to load products'); }
  }
  useEffect(() => { load(1, q); }, []);
  useEffect(() => { load(page, q); }, [page]);

  async function onSubmit(e) {
    e.preventDefault(); setSaving(true); setError(''); setNotice('');
    try {
      const priceCents = Math.round(parseFloat(form.price || '0') * 100);
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, priceCents }) });
      if (!res.ok) { setError('Failed to save product'); return; }
      setForm({ name: '', price: '' }); setNotice('Product added'); setPage(1); await load(1, q);
    } catch { setError('Failed to save product'); } finally { setSaving(false); }
  }

  async function onDelete(id) {
    setError(''); setNotice(''); if (!confirm('Delete this product?')) return;
    try {
      await fetch(API + '/' + id, { method: 'DELETE' }); setNotice('Product deleted');
      const maxPage = Math.max(1, Math.ceil((total - 1) / pageSize));
      const nextPage = Math.min(page, maxPage); setPage(nextPage); await load(nextPage, q);
    } catch { setError('Failed to delete'); }
  }

  function startEdit(p) { setEditId(p.id); setEditForm({ name: p.name, price: (p.priceCents/100).toFixed(2) }); }
  function cancelEdit() { setEditId(null); setEditForm({ name: '', price: '' }); }
  async function saveEdit(id) {
    setError(''); setNotice('');
    try {
      const priceCents = Math.round(parseFloat(editForm.price || '0') * 100);
      const res = await fetch(API + '/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editForm.name, priceCents }) });
      if (!res.ok) { setError('Failed to update'); return; }
      setNotice('Product updated'); setEditId(null); await load(page, q);
    } catch { setError('Failed to update'); }
  }

  return (
    <div className="card p-6 space-y-6">
      <h1>Products</h1>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input className="input md:w-80" placeholder="Search products…" value={q} onChange={(e)=>{ setQ(e.target.value); setPage(1); load(1, e.target.value); }} />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input w-full" placeholder="Name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required />
        <input className="input w-full" placeholder="Price (e.g. 12.99)" type="number" step="0.01" min="0" value={form.price} onChange={(e)=>setForm({ ...form, price: e.target.value })} required />
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Add Product'}</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {notice && <p className="text-green-700 text-sm">{notice}</p>}
      </form>

      <div>
        <h2 className="mb-3">Current Products</h2>
        <ul className="space-y-2">
          {items.map(p => {
            const isEdit = editId === p.id;
            return (
              <li key={p.id} className="border rounded-xl p-3 flex items-center justify-between gap-3">
                {!isEdit ? (
                  <>
                    <div>
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-2 text-sm text-slate-600">${(p.priceCents/100).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="px-3 py-1.5 rounded-lg bg-slate-100">Edit</button>
                      <button onClick={() => onDelete(p.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white">Delete</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <input className="input flex-1" value={editForm.name} onChange={(e)=>setEditForm({ ...editForm, name: e.target.value })} />
                      <input className="input w-32" type="number" step="0.01" min="0" value={editForm.price} onChange={(e)=>setEditForm({ ...editForm, price: e.target.value })} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(p.id)} className="px-3 py-1.5 rounded-lg bg-[var(--brand-blue)] text-white">Save</button>
                      <button onClick={cancelEdit} className="px-3 py-1.5 rounded-lg bg-slate-100">Cancel</button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
          {items.length === 0 && <li className="text-slate-500">No products on this page.</li>}
        </ul>
        <Pager page={page} pageSize={pageSize} total={total} onChange={setPage} />
      </div>
    </div>
  );
}
