'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#172B4D] mb-2">
          Tạo tài khoản
        </h1>
        <p className="text-gray-500">
          Bắt đầu với tài khoản miễn phí của bạn
        </p>
      </div>

      {/* Register Form */}
      <RegisterForm />

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link
            href="/login"
            className="text-[#0052CC] hover:text-blue-700 font-semibold"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
