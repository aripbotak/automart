'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ShieldCheck,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Share2,
  Heart,
  Car,
} from 'lucide-react';
import { ImageGallery } from '@/components/shared/ImageGallery';
import { InquiryModal } from '@/components/features/InquiryModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useVehicleDetail } from '@/hooks/useVehicles';
import { useVehicleStore } from '@/hooks/useVehicleStore';
import { formatCurrency, formatMileage } from '@/lib/utils';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params?.id as string;

  const { data: vehicle, isLoading } = useVehicleDetail(vehicleId);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const { savedVehicleIds, toggleSavedVehicle } = useVehicleStore();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Vehicle Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">The requested vehicle listing is no longer active.</p>
        <Link href="/vehicles" className="mt-6 inline-block">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isSaved = savedVehicleIds.includes(vehicle.id);
  const estMonthly = Math.round((vehicle.price * 0.9) / 60); // Simple 60-month finance estimation

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Inventory</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSavedVehicle(vehicle.id)}
            leftIcon={<Heart className={`h-4 w-4 ${isSaved ? 'text-rose-500 fill-rose-500' : ''}`} />}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">
        {/* Left Column: Image Gallery & Detailed Specs */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand">{vehicle.condition}</Badge>
              <Badge variant="neutral">{vehicle.bodyType}</Badge>
              {vehicle.fuelType === 'Electric' && <Badge variant="electric">EV Zero-Emission</Badge>}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {vehicle.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              VIN: <span className="font-mono text-slate-700">{vehicle.vin}</span> • Stock ID: {vehicle.id}
            </p>
          </div>

          {/* Interactive CDN Image Gallery */}
          <ImageGallery images={vehicle.images} title={vehicle.title} />

          {/* Overview Specs Grid */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Technical Specifications</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-xs font-medium text-slate-400">Mileage</span>
                <span className="mt-1 block text-base font-bold text-slate-900">
                  {formatMileage(vehicle.mileage)}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-xs font-medium text-slate-400">Engine / Motor</span>
                <span className="mt-1 block text-sm font-bold text-slate-900 truncate">
                  {vehicle.engine}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-xs font-medium text-slate-400">Horsepower</span>
                <span className="mt-1 block text-base font-bold text-slate-900">
                  {vehicle.horsepower} HP
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-xs font-medium text-slate-400">Drivetrain</span>
                <span className="mt-1 block text-base font-bold text-slate-900">
                  {vehicle.drivetrain}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-xs font-medium text-slate-400">Transmission</span>
                <span className="mt-1 block text-base font-bold text-slate-900">
                  {vehicle.transmission}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-xs font-medium text-slate-400">Fuel Type</span>
                <span className="mt-1 block text-base font-bold text-slate-900">
                  {vehicle.fuelType}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-xs font-medium text-slate-400">Exterior Color</span>
                <span className="mt-1 block text-base font-bold text-slate-900 truncate">
                  {vehicle.exteriorColor}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-xs font-medium text-slate-400">Interior Color</span>
                <span className="mt-1 block text-base font-bold text-slate-900 truncate">
                  {vehicle.interiorColor}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Description */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Vehicle Overview & History</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {vehicle.description}
            </p>
          </div>

          {/* Premium Equipment & Features */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Key Packages & Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicle.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Summary & Inquiry Booking Box */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
          {/* Price Box */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Dealer Listed Price
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {formatCurrency(vehicle.price)}
                </span>
                {vehicle.originalPrice && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    {formatCurrency(vehicle.originalPrice)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Est. <span className="font-bold text-brand-600">{formatCurrency(estMonthly)}/mo</span> with $0 down for 60 mos
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsInquiryOpen(true)}
                className="w-full justify-center shadow-lg shadow-brand-500/20"
              >
                Inquire / Book Test Drive
              </Button>

              <Button
                variant="outline"
                size="md"
                className="w-full justify-center"
                leftIcon={<FileText className="h-4 w-4" />}
              >
                Download Window Sticker (PDF)
              </Button>
            </div>

            {/* Verified Dealer Badge Card */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{vehicle.seller.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{vehicle.seller.rating}</span>
                    <span className="text-slate-400 font-normal">({vehicle.seller.totalReviews} reviews)</span>
                  </div>
                </div>
                {vehicle.seller.isVerifiedDealer && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{vehicle.seller.city}, {vehicle.seller.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{vehicle.seller.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry / Booking Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        vehicle={vehicle}
      />
    </div>
  );
}
