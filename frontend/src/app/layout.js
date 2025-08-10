import './globals.css';
import { Inter } from 'next/font/google';
import Nav from '../components/Nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Cannabis Delivery MVP',
  description: 'Admin UI for customers and products',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <header className="border-b bg-white">
          <Nav />
        </header>
        <main className="max-w-5xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
