import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AutoMart | Modern Luxury & Everyday Automotive Marketplace',
  description:
    'Discover, buy, and sell luxury sports cars, premium SUVs, and cutting-edge electric vehicles with verified inspection reports and transparent pricing.',
  keywords: [
    'Auto Mart',
    'Cars for sale',
    'Electric Vehicles',
    'Porsche',
    'Tesla',
    'Luxury Cars',
    'Car Marketplace',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
