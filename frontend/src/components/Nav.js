'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/customers', label: 'Customers' },
  { href: '/products',  label: 'Products'  },
  { href: '/orders',    label: 'Orders'    },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto max-w-5xl h-16 px-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">DankDash</Link>
        <ul className="flex items-center gap-2">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-3 py-2 rounded-lg text-slate-700 ${active ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
