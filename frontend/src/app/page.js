'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE } from '../lib/api';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function refreshStats() {
    try {
      const res = await fetch(API_BASE + '/stats', { cache: 'no-store' });
      setStats(await res.json());
    } catch { setError('Failed to load stats'); }
  }

  useEffect(() => { refreshStats(); }, []);

  async function seedDemo() {
    setError(''); setNotice('');
    try {
      // add two products and one customer (idempotent enough for dev)
      await fetch(API_BASE + '/products', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'OG Kush 1g', priceCents: 1299 }) });
      await fetch(API_BASE + '/products', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Blue Dream 3.5g', priceCents: 3499 }) });
      await fetch(API_BASE + '/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' }) });
      setNotice('Sample data added (or already there)');
      await refreshStats();
    } catch { setError('Failed to add sample data'); }
  }

  const Card = ({ title, value, href }) => (
    <Link href={href} className="card p-5 block hover:shadow transition">
      <div className="text-sm text-slate-600">{title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </Link>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={seedDemo} className="btn-primary">Add sample data</button>
        <a href={API_BASE} target="_blank" className="px-3 py-2 rounded-lg bg-slate-100">Open API root</a>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {notice && <p className="text-green-700">{notice}</p>}

      <div className="grid gap-4 md:grid-cols-4">
        {stats ? (
          <>
            <Card title="Customers" value={stats.customers} href="/customers" />
            <Card title="Products"  value={stats.products}  href="/products" />
            <Card title="Orders"    value={stats.orders}    href="/orders" />
            <Card title="Revenue"   value={'$' + ((stats.totalRevenueCents||0)/100).toFixed(2)} href="/orders" />
          </>
        ) : (
          <div className="col-span-4 text-slate-600">Loading…</div>
        )}
      </div>
    </div>
  );
}
