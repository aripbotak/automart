'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Gauge, Fuel, Cog, ShieldCheck } from 'lucide-react';
import { Vehicle } from '@/types';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatMileage } from '@/lib/utils';
import { useVehicleStore } from '@/hooks/useVehicleStore';
import { cn } from '@/lib/utils';

export interface VehicleCardProps {
  vehicle: Vehicle;
  priority?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, priority = false }) => {
  const { savedVehicleIds, toggleSavedVehicle } = useVehicleStore();
  const isSaved = savedVehicleIds.includes(vehicle.id);
  const primaryImage = vehicle.images.find((img) => img.isPrimary) || vehicle.images[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Vehicle Media Header */}
      <div className="relative w-full overflow-hidden bg-slate-100">
        <Link href={`/vehicles/${vehicle.id}`}>
          <OptimizedImage
            src={primaryImage?.url || '/images/vehicle-placeholder.png'}
            alt={vehicle.title}
            aspectRatio="16/9"
            priority={priority}
            quality={80}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5">
          {vehicle.condition === 'Brand New' && (
            <Badge variant="brand">Brand New</Badge>
          )}
          {vehicle.condition === 'Certified Pre-Owned' && (
            <Badge variant="success">Certified</Badge>
          )}
          {vehicle.fuelType === 'Electric' && (
            <Badge variant="electric">100% Electric</Badge>
          )}
        </div>

        {/* Favorite Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleSavedVehicle(vehicle.id);
          }}
          className={cn(
            'absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition hover:scale-110 active:scale-95',
            isSaved ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500'
          )}
          aria-label={isSaved ? 'Remove from saved' : 'Save vehicle'}
        >
          <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
        </button>

        {/* Original Price Discount Tag */}
        {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
          <div className="absolute bottom-3 left-3.5 rounded-lg bg-emerald-600/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
            Save {formatCurrency(vehicle.originalPrice - vehicle.price)}
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            {vehicle.make}
          </span>
          <span className="text-xs text-slate-400 font-medium">{vehicle.year}</span>
        </div>

        <Link href={`/vehicles/${vehicle.id}`} className="mt-1 block group-hover:text-brand-600 transition-colors">
          <h3 className="text-base font-bold text-slate-900 line-clamp-1">
            {vehicle.title}
          </h3>
        </Link>

        {/* Key Specs Row */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cog className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{vehicle.transmission}</span>
          </div>
        </div>

        {/* Price & Dealer Information Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Starting at
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900">
                {formatCurrency(vehicle.price)}
              </span>
            </div>
          </div>

          <Link
            href={`/vehicles/${vehicle.id}`}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
