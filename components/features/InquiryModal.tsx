'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Vehicle, InquiryFormData } from '@/types';
import { useSubmitInquiry } from '@/hooks/useVehicles';
import { CheckCircle2, Calendar, Phone, Mail, User } from 'lucide-react';

export interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const submitInquiryMutation = useSubmitInquiry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    defaultValues: {
      vehicleId: vehicle.id,
      name: '',
      email: '',
      phone: '',
      message: `Hi, I am interested in this ${vehicle.year} ${vehicle.title}. Please provide more details.`,
      requestTestDrive: true,
      tradeInInterest: false,
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    try {
      await submitInquiryMutation.mutateAsync({
        ...data,
        vehicleId: vehicle.id,
      });
      setIsSuccess(true);
    } catch {
      // Handled by mutation error state
    }
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isSuccess ? 'Inquiry Sent Successfully!' : `Inquire About ${vehicle.title}`}
      description={
        isSuccess
          ? 'The dealer concierge has received your request and will contact you promptly.'
          : `Listing ID: ${vehicle.id} • Seller: ${vehicle.seller.name}`
      }
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">We will reach out to you shortly!</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
            A confirmation email has been dispatched with dealer location details and direct contact credentials.
          </p>
          <Button onClick={handleModalClose} variant="primary" className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Alexander Wright"
            startIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name', { required: 'Full name is required' })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              startIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Enter a valid email address',
                },
              })}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              startIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register('phone', { required: 'Phone number is required' })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Preferred Test Drive Date (Optional)
            </label>
            <div className="relative">
              <input
                type="date"
                {...register('preferredDate')}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Message
            </label>
            <textarea
              rows={3}
              {...register('message')}
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                {...register('requestTestDrive')}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Schedule a VIP Test Drive on site</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                {...register('tradeInInterest')}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span>I have a vehicle I want to trade in for this car</span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitInquiryMutation.isPending}
            >
              Submit Inquiry
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default InquiryModal;
