import React from 'react';
import Link from 'next/link';
import { Car, LayoutDashboard, PlusCircle, LogOut, PackageCheck } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin/Seller Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Car className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">
              AUTO<span className="text-brand-600">MART</span> Portal
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-600">
            <Link
              href="/seller"
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-brand-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Inventory Management</span>
            </Link>
            <Link
              href="/vehicles"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 hover:bg-slate-50 text-slate-600"
            >
              <PackageCheck className="h-4 w-4" />
              <span>Public Showcase</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
              <LogOut className="h-4 w-4" />
              <span>Exit Portal</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
