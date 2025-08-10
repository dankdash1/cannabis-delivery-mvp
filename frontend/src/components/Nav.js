import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="max-w-5xl mx-auto flex items-center gap-4 p-4">
      <Link href="/" className="font-bold mr-4">Cannabis Delivery</Link>
      <Link href="/customers" className="hover:underline">Customers</Link>
      <Link href="/products" className="hover:underline">Products</Link>
    </nav>
  );
}
