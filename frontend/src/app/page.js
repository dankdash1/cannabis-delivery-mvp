import Link from 'next/link';

async function getCounts() {
  try {
    const [customers, products] = await Promise.all([
      fetch('http://localhost:4002/customers', { cache: 'no-store' }).then(r => r.json()),
      fetch('http://localhost:4002/products',  { cache: 'no-store' }).then(r => r.json()),
    ]);
    return { customers: customers.length, products: products.length };
  } catch {
    return { customers: 0, products: 0 };
  }
}

export default async function Home() {
  const { customers, products } = await getCounts();
  const Card = ({ title, value, href }) => (
    <Link href={href} className="block rounded-2xl border bg-white p-5 shadow hover:shadow-md transition">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
    </Link>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="Customers" value={customers} href="/customers" />
        <Card title="Products" value={products} href="/products" />
      </div>
    </div>
  );
}
