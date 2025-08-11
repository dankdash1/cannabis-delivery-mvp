'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/customers', label: 'Customers' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <div className="text-lg font-semibold">DankDash</div>
        <ul className="flex items-center gap-2 sm:gap-4 text-sm">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-lg px-3 py-2 hover:bg-gray-100 ${
                    active ? 'bg-gray-900 text-white hover:bg-gray-900' : 'text-gray-700'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
