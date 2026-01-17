'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#172B4D] mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500">
          Sign in to your account to continue
        </p>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-[#0052CC] hover:text-blue-700 font-semibold"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      {/* Divider */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-[#0052CC] hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#0052CC] hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
