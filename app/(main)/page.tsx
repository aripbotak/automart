'use client';

import React from 'react';
import Link from 'next/link';
import {
  Car,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Truck,
  Check,
} from 'lucide-react';
import { SearchBar } from '@/components/shared/SearchBar';
import { VehicleCard } from '@/components/features/VehicleCard';
import { useVehicles } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  { name: 'Electric & Hybrid', count: '142 Cars', slug: 'Electric', icon: Zap, bg: 'from-cyan-500/10 to-blue-500/10' },
  { name: 'Luxury SUVs', count: '280 Cars', slug: 'SUV', icon: Car, bg: 'from-brand-500/10 to-indigo-500/10' },
  { name: 'Sports & Coupes', count: '94 Cars', slug: 'Coupe', icon: Sparkles, bg: 'from-amber-500/10 to-orange-500/10' },
  { name: 'Premium Sedans', count: '190 Cars', slug: 'Sedan', icon: Award, bg: 'from-purple-500/10 to-pink-500/10' },
  { name: 'Trucks & 4x4', count: '85 Cars', slug: 'Truck', icon: Truck, bg: 'from-emerald-500/10 to-teal-500/10' },
];

export default function HomePage() {
  const { data: vehicleData, isLoading } = useVehicles({ limit: 6, sortBy: 'newest' });

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* ========================================================
          1. HERO BANNER SECTION
      ======================================================== */}
      <section className="relative overflow-hidden bg-slate-950 pt-20 pb-28 text-white">
        {/* Ambient Gradient Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-brand-600/30 via-cyan-500/20 to-indigo-600/30 blur-[130px] opacity-60" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-brand-400 animate-pulse" />
              <span>Next-Gen Automotive Marketplace 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-balance">
              Find Your Dream Car with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-300 to-brand-200">Total Transparency.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
              Browse thousands of certified new, pre-owned, and luxury electric vehicles with verified history reports, instant financing, and home delivery.
            </p>
          </div>

          {/* Quick Search Bar Widget */}
          <div className="mt-12 max-w-5xl mx-auto">
            <SearchBar variant="hero" />
          </div>

          {/* Trust Metrics */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-8 sm:grid-cols-4 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">25,000+</p>
              <p className="text-xs text-slate-400 mt-0.5">Verified Listings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">99.4%</p>
              <p className="text-xs text-slate-400 mt-0.5">Customer Satisfaction</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">150-Point</p>
              <p className="text-xs text-slate-400 mt-0.5">Dealer Inspection</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">0% APR</p>
              <p className="text-xs text-slate-400 mt-0.5">Financing Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. CATEGORY BROWSER
      ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Curated Body Styles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Browse by Vehicle Category
            </h2>
          </div>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
          >
            <span>Explore All Styles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/vehicles?bodyType=${cat.slug}`}
                className="group relative flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-200/80 bg-white shadow-card hover:shadow-card-hover hover:border-brand-300 transition-all duration-300 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:scale-110 transition duration-200">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-slate-400 mt-0.5">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. FEATURED VEHICLES SHOWCASE
      ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Handpicked Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Featured Premium Inventory
            </h2>
          </div>
          <Link href="/vehicles">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View Complete Inventory
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicleData?.data.map((vehicle, idx) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} priority={idx === 0} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          4. SELLER & TRADE-IN CALL TO ACTION
      ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 p-8 sm:p-14 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex rounded-full bg-brand-500/20 px-3.5 py-1 text-xs font-bold text-brand-300 border border-brand-400/30">
              Instant Seller Portal
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Sell or Trade-In Your Current Vehicle?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Get an instant algorithmic valuation in 60 seconds. List for free or sell directly to our verified dealer network with zero hassle.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/seller">
                <Button variant="primary" size="lg">
                  Get Instant Valuation
                </Button>
              </Link>
              <Link href="/vehicles">
                <Button variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                  Explore Trade-in Offers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
