'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#172B4D] mb-2">
          Chào mừng trở lại
        </h1>
        <p className="text-gray-500">
          Đăng nhập vào tài khoản của bạn để tiếp tục
        </p>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link
            href="/register"
            className="text-[#0052CC] hover:text-blue-700 font-semibold"
          >
            Đăng ký miễn phí
          </Link>
        </p>
      </div>

      {/* Divider */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <a href="#" className="text-[#0052CC] hover:underline">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="#" className="text-[#0052CC] hover:underline">
            Chính sách bảo mật
          </a>
        </p>
      </div>
    </div>
  );
}
