'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';
const API = `${API_BASE}/customers`;

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try { const res = await fetch(API, { cache: 'no-store' }); setCustomers(await res.json()); }
    catch { setError('Failed to load customers'); }
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const res = await fetch(API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setForm({ name: '', email: '' }); await load();
    } catch { setError('Failed to save customer'); } finally { setSaving(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Customers</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-[--brand-blue] focus:border-[--brand-blue]"
          placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-[--brand-blue] focus:border-[--brand-blue]"
          placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <button className="rounded-xl px-4 py-2 text-white bg-[--brand-blue] hover:brightness-110 disabled:opacity-50" disabled={saving}>
          {saving ? 'Saving…' : 'Add Customer'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      <div>
        <h2 className="font-medium mb-3">Current Customers</h2>
        <ul className="space-y-2">
          {customers.map((c) => (
            <li key={c.id} className="rounded-xl border border-slate-200 p-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-slate-600">{c.email}</div>
            </li>
          ))}
          {customers.length === 0 && <li className="text-slate-500">No customers yet.</li>}
        </ul>
      </div>
    </div>
  );
}
