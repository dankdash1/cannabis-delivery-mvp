import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: 'DankDash',
  description: 'Simple MVP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1 grid place-items-center p-6">
            <div className="w-full max-w-3xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
