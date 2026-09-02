'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulated token login
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (typeof window !== 'undefined') {
      localStorage.setItem('automart_auth_token', 'mock_jwt_token_sample_12345');
    }
    setIsLoading(false);
    router.push('/vehicles');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to access your saved cars, dealer dashboard, and test drive schedules.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
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
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="font-semibold text-brand-600 hover:text-brand-700">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          leftIcon={<LogIn className="h-4 w-4" />}
          className="w-full justify-center"
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-bold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </div>
    </div>
  );
}
