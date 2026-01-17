'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#172B4D] mb-2">
          Create Account
        </h1>
        <p className="text-gray-500">
          Get started with your free account
        </p>
      </div>

      {/* Register Form */}
      <RegisterForm />

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#0052CC] hover:text-blue-700 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
