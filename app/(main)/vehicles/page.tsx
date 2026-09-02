'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { VehicleFilter } from '@/components/features/VehicleFilter';
import { VehicleCard } from '@/components/features/VehicleCard';
import { useVehicles } from '@/hooks/useVehicles';
import { useVehicleStore } from '@/hooks/useVehicleStore';
import { Button } from '@/components/ui/Button';

function VehicleListingContent() {
  const searchParams = useSearchParams();
  const { filters, setFilter, viewMode, setViewMode } = useVehicleStore();

  const { data: response, isLoading, isError } = useVehicles(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Vehicle Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-800">{response?.total || 0}</span> verified vehicles ready for purchase or home delivery
          </p>
        </div>

        {/* Sort & View Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400">Sort By:</span>
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) => setFilter('sortBy', e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-brand-500 focus:outline-none"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_desc">Year: Newest First</option>
              <option value="mileage_asc">Lowest Mileage</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Filter & Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 items-start">
        {/* Filter Sidebar (1 col on desktop) */}
        <div className="lg:col-span-1">
          <VehicleFilter />
        </div>

        {/* Vehicle Grid (3 cols on desktop) */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : isError || !response?.data?.length ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <SlidersHorizontal className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Vehicles Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
                Try adjusting your search criteria or removing active filters to see available stock.
              </p>
              <Button onClick={() => useVehicleStore.getState().resetFilters()} variant="outline">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {response.data.map((vehicle, idx) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} priority={idx < 3} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {response && response.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => setFilter('page', (filters.page || 1) - 1)}
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-slate-600 px-3">
                Page {filters.page || 1} of {response.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page || 1) >= response.totalPages}
                onClick={() => setFilter('page', (filters.page || 1) + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VehicleListingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading catalog...</div>}>
      <VehicleListingContent />
    </Suspense>
  );
}
