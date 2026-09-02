'use client';

import React from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VEHICLE_MAKES, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from '@/lib/constants';
import { useVehicleStore } from '@/hooks/useVehicleStore';
import { BodyType, FuelType, TransmissionType, VehicleCondition } from '@/types';

export const VehicleFilter: React.FC = () => {
  const { filters, setFilter, resetFilters } = useVehicleStore();

  return (
    <aside className="w-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-brand-600" />
          <h2 className="text-base font-bold text-slate-900">Filter Vehicles</h2>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-brand-600 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Make / Brand */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Make / Manufacturer
        </label>
        <select
          value={filters.make || ''}
          onChange={(e) => setFilter('make', e.target.value || undefined)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
        >
          <option value="">All Makes</option>
          {VEHICLE_MAKES.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      {/* Body Style Chips */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Body Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BODY_TYPES.map((type) => {
            const isSelected = filters.bodyType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setFilter('bodyType', isSelected ? '' : type)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              setFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-brand-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              setFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Year Range */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Model Year
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="From (e.g. 2020)"
            value={filters.minYear ?? ''}
            onChange={(e) =>
              setFilter('minYear', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-brand-500"
          />
          <input
            type="number"
            placeholder="To (e.g. 2024)"
            value={filters.maxYear ?? ''}
            onChange={(e) =>
              setFilter('maxYear', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Fuel & Powertrain
        </label>
        <select
          value={filters.fuelType || ''}
          onChange={(e) => setFilter('fuelType', (e.target.value as FuelType) || '')}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
        >
          <option value="">All Fuel Types</option>
          {FUEL_TYPES.map((fuel) => (
            <option key={fuel} value={fuel}>
              {fuel}
            </option>
          ))}
        </select>
      </div>

      {/* Transmission */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Transmission
        </label>
        <select
          value={filters.transmission || ''}
          onChange={(e) =>
            setFilter('transmission', (e.target.value as TransmissionType) || '')
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
        >
          <option value="">All Transmissions</option>
          {TRANSMISSION_TYPES.map((trans) => (
            <option key={trans} value={trans}>
              {trans}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Condition
        </label>
        <select
          value={filters.condition || ''}
          onChange={(e) =>
            setFilter('condition', (e.target.value as VehicleCondition) || '')
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
        >
          <option value="">All Conditions</option>
          <option value="Brand New">Brand New</option>
          <option value="Certified Pre-Owned">Certified Pre-Owned</option>
          <option value="Used">Used</option>
        </select>
      </div>
    </aside>
  );
};

export default VehicleFilter;
