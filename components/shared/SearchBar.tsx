'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Car, DollarSign, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VEHICLE_MAKES, BODY_TYPES } from '@/lib/constants';
import { useVehicleStore } from '@/hooks/useVehicleStore';

export const SearchBar: React.FC<{ variant?: 'hero' | 'compact' }> = ({ variant = 'hero' }) => {
  const router = useRouter();
  const { setFilters } = useVehicleStore();

  const [query, setQuery] = useState('');
  const [make, setMake] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      query: query || undefined,
      make: make || undefined,
      bodyType: (bodyType as any) || undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });

    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (make) params.set('make', make);
    if (bodyType) params.set('bodyType', bodyType);
    if (maxPrice) params.set('maxPrice', maxPrice);

    router.push(`/vehicles?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="relative flex w-full items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Make, Model, or Keyword..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-28 text-sm text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
        <Button
          type="submit"
          size="sm"
          className="absolute right-2"
        >
          Search
        </Button>
      </form>
    );
  }

  return (
    <div className="w-full rounded-3xl bg-white/95 p-4 sm:p-6 shadow-2xl backdrop-blur-lg border border-slate-200/80">
      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search Keyword */}
        <div className="relative flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Keyword or Model
          </label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 911 Carrera, Plaid"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
            />
          </div>
        </div>

        {/* Make Select */}
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Vehicle Make
          </label>
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition cursor-pointer"
          >
            <option value="">All Makes & Brands</option>
            {VEHICLE_MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Body Type Select */}
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Body Style
          </label>
          <select
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition cursor-pointer"
          >
            <option value="">All Body Styles</option>
            {BODY_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Search Button */}
        <div className="flex flex-col justify-end">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Max Budget
          </label>
          <div className="flex items-center gap-2">
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition cursor-pointer"
            >
              <option value="">No Max Limit</option>
              <option value="30000">Up to $30,000</option>
              <option value="50000">Up to $50,000</option>
              <option value="80000">Up to $80,000</option>
              <option value="120000">Up to $120,000</option>
              <option value="200000">Up to $200,000</option>
            </select>
            <Button
              type="submit"
              size="md"
              leftIcon={<Search className="h-4 w-4" />}
              className="shrink-0 px-5"
            >
              Search
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
