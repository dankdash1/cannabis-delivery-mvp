'use client';
import { useEffect, useState } from 'react';
import Pager from '../../components/Pager';
import { API_BASE } from '../../lib/api';
const API = API_BASE + '/customers';
const API_UTIL = API_BASE + '/util/customers';

export default function CustomersPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [q, setQ] = useState('');

  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

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
    } catch { setError('Failed to load customers'); }
  }
  useEffect(() => { load(1, q); }, []);           // initial
  useEffect(() => { load(page, q); }, [page]);    // page change

  async function onSubmit(e) {
    e.preventDefault(); setSaving(true); setError(''); setNotice('');
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) { setError(res.status === 409 ? 'Email already exists' : 'Failed to save customer'); return; }
      setForm({ name: '', email: '' }); setNotice('Customer added');
      setPage(1); await load(1, q);
    } catch { setError('Failed to save customer'); } finally { setSaving(false); }
  }

  async function onDelete(id) {
    setError(''); setNotice(''); if (!confirm('Delete this customer?')) return;
    try {
      await fetch(API + '/' + id, { method: 'DELETE' }); setNotice('Customer deleted');
      const maxPage = Math.max(1, Math.ceil((total - 1) / pageSize));
      const nextPage = Math.min(page, maxPage); setPage(nextPage); await load(nextPage, q);
    } catch { setError('Failed to delete'); }
  }

  function onSearch(e) { const v = e.target.value; setQ(v); setPage(1); load(1, v); }

  return (
    <div className="card p-6 space-y-6">
      <h1>Customers</h1>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input className="input md:w-80" placeholder="Search name or email…" value={q} onChange={onSearch} />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input w-full" placeholder="Name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required />
        <input className="input w-full" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} required />
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Add Customer'}</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {notice && <p className="text-green-700 text-sm">{notice}</p>}
      </form>

      <div>
        <h2 className="mb-3">Current Customers</h2>
        <ul className="space-y-2">
          {items.map(c => (
            <li key={c.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-slate-600">{c.email}</div>
              </div>
              <button onClick={() => onDelete(c.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white">Delete</button>
            </li>
          ))}
          {items.length === 0 && <li className="text-slate-500">No customers on this page.</li>}
        </ul>
        <Pager page={page} pageSize={pageSize} total={total} onChange={setPage} />
      </div>
    </div>
  );
}
