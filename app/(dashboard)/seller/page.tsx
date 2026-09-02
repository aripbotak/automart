'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Car,
  Plus,
  DollarSign,
  Eye,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DynamicImageUploader } from '@/components/features/DynamicImageUploader';
import { MOCK_VEHICLES, VEHICLE_MAKES, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from '@/lib/constants';
import { formatCurrency, formatMileage } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface NewVehicleFormValues {
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  vin: string;
  description: string;
}

export default function SellerDashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewVehicleFormValues>();

  const onAddVehicle = (data: NewVehicleFormValues) => {
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      setShowAddModal(false);
      reset();
      setUploadedUrls([]);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Top Metric Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dealer & Seller Hub
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage active vehicle stock, CDN media assets, and incoming customer inquiries.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add New Vehicle
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Listed Vehicles</span>
            <div className="rounded-xl bg-blue-50 p-2 text-brand-600">
              <Car className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">{MOCK_VEHICLES.length}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">● All Active & Live</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Portfolio Value</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {formatCurrency(MOCK_VEHICLES.reduce((acc, v) => acc + v.price, 0))}
          </p>
          <span className="text-xs text-slate-400 font-medium mt-1 inline-block">Estimated retail valuation</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Showcase Views</span>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">14,820</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">+24% this week</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Pending Inquiries</span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">8</p>
          <span className="text-xs text-amber-600 font-semibold mt-1 inline-block">Requires follow-up</span>
        </div>
      </div>

      {/* Inventory Management Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Current Inventory</h2>
          <span className="text-xs text-slate-400 font-semibold">{MOCK_VEHICLES.length} Units Available</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Vehicle</th>
                <th className="py-3 px-4">VIN</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Mileage</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {MOCK_VEHICLES.map((vehicle) => {
                const img = vehicle.images[0]?.url || '/images/vehicle-placeholder.png';
                return (
                  <tr key={vehicle.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 overflow-hidden rounded-xl bg-slate-100 relative shrink-0">
                          <OptimizedImage
                            src={img}
                            alt={vehicle.title}
                            aspectRatio="4/3"
                            quality={50}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{vehicle.title}</span>
                          <span className="text-slate-400 text-[11px]">
                            {vehicle.make} • {vehicle.year}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600">{vehicle.vin}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{formatCurrency(vehicle.price)}</td>
                    <td className="py-4 px-4 text-slate-600">{formatMileage(vehicle.mileage)}</td>
                    <td className="py-4 px-4">
                      <Badge variant="neutral">{vehicle.condition}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Available
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal Drawer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">List New Vehicle</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add specs and upload high-res photos to our Cloudinary / AWS S3 media pipeline.
              </p>
            </div>

            {isSavedSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
                <h3 className="text-lg font-bold text-slate-900">Vehicle Listed Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your vehicle has been optimized and syndicated to the global inventory catalog.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onAddVehicle)} className="space-y-4">
                {/* Media Uploader Hooked to CDN Pipeline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Vehicle Photography (Cloudinary / S3 WebP Pipeline)
                  </label>
                  <DynamicImageUploader
                    onUploadComplete={(urls) => setUploadedUrls(urls)}
                    maxFiles={6}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Listing Title"
                    placeholder="e.g. 2024 Porsche 911 GT3"
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required' })}
                  />

                  <Input
                    label="VIN"
                    placeholder="17-character VIN"
                    error={errors.vin?.message}
                    {...register('vin', { required: 'VIN is required' })}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Make</label>
                    <select
                      {...register('make', { required: true })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    >
                      {VEHICLE_MAKES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Year</label>
                    <input
                      type="number"
                      defaultValue={2024}
                      {...register('year', { required: true })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      placeholder="85000"
                      {...register('price', { required: true })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Mileage</label>
                    <input
                      type="number"
                      placeholder="1200"
                      {...register('mileage', { required: true })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Detail packages, condition, and maintenance records..."
                    {...register('description')}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Publish Listing
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
