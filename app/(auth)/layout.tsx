import React from 'react';
import Link from 'next/link';
import { Car } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-brand-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30">
            <Car className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            AUTO<span className="text-brand-400">MART</span>
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200/20 text-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}
