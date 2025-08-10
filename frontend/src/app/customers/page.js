'use client';

import { useEffect, useState } from 'react';
const API = 'http://localhost:4002/customers';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try { const res = await fetch(API, { cache: 'no-store' }); setCustomers(await res.json()); }
    catch { setError('Failed to load customers'); }
  };
  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Request failed');
      setForm({ name: '', email: '' }); await load();
    } catch { setError('Failed to save customer'); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <form onSubmit={onSubmit} className="space-y-3 bg-white rounded-2xl shadow p-4">
        <input className="w-full border rounded-xl p-2" placeholder="Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="w-full border rounded-xl p-2" placeholder="Email" type="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Add Customer'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="font-semibold mb-3">Current Customers</h2>
        <ul className="space-y-2">
          {customers.map((c) => (
            <li key={c.id} className="border rounded-xl p-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-600">{c.email}</div>
            </li>
          ))}
          {customers.length === 0 && <li className="text-gray-500">No customers yet.</li>}
        </ul>
      </div>
    </div>
  );
}
