'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Building } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  accountType: 'buyer' | 'seller';
}

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      accountType: 'buyer',
    },
  });

  const accountType = watch('accountType');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (typeof window !== 'undefined') {
      localStorage.setItem('automart_auth_token', 'mock_jwt_registered_sample');
    }
    setIsLoading(false);
    router.push(accountType === 'seller' ? '/seller' : '/vehicles');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create an Account
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Join AutoMart to buy, trade, or list vehicles with zero friction.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Account Role Selector */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <label
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition ${
              accountType === 'buyer'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <input
              type="radio"
              value="buyer"
              className="hidden"
              {...register('accountType')}
            />
            <User className="h-3.5 w-3.5" />
            <span>Buyer</span>
          </label>

          <label
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition ${
              accountType === 'seller'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <input
              type="radio"
              value="seller"
              className="hidden"
              {...register('accountType')}
            />
            <Building className="h-3.5 w-3.5" />
            <span>Seller / Dealer</span>
          </label>
        </div>

        <Input
          label="Full Name or Business Name"
          placeholder="e.g. John Doe"
          startIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="alex@example.com"
          startIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          startIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Must be at least 6 characters',
            },
          })}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full justify-center"
        >
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link href="/login" className="font-bold text-brand-600 hover:text-brand-700">
          Sign In
        </Link>
      </div>
    </div>
  );
}
