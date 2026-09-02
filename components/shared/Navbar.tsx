'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Heart, PlusCircle, User, Menu, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useVehicleStore } from '@/hooks/useVehicleStore';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const savedVehicleIds = useVehicleStore((state) => state.savedVehicleIds);

  const navLinks = [
    { name: 'Browse Inventory', href: '/vehicles' },
    { name: 'New Arrivals', href: '/vehicles?condition=Brand+New' },
    { name: 'Electric & Hybrids', href: '/vehicles?fuelType=Electric' },
    { name: 'Sell Your Car', href: '/seller' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition duration-200">
            <Car className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
              AUTO<span className="text-brand-600">MART</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">
              Premier Auto Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-sm font-semibold transition-colors duration-150',
                  isActive
                    ? 'text-brand-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/vehicles" className="relative">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Heart className="h-4 w-4 text-rose-500" />}
              className="relative"
            >
              Saved
              {savedVehicleIds.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-5 w-5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {savedVehicleIds.length}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/seller">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PlusCircle className="h-4 w-4 text-brand-600" />}
            >
              List Vehicle
            </Button>
          </Link>

          <Link href="/login">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<User className="h-4 w-4" />}
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link href="/seller" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                List Your Vehicle
              </Button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                Sign In / Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
