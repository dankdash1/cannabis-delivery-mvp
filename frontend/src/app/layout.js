// src/app/layout.js
import './globals.css';
import Nav from '@/components/Nav'; // if this errors, change to: ../components/Nav

export const metadata = {
  title: 'DankDash',
  description: 'Simple customers, products, and orders demo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Nav />
        <main className="max-w-5xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
