'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useAuth } from '@/lib/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/lib/utils/validation';

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      username: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      phone: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerUser(registerData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Username */}
      <Input
        label="Tên đăng nhập"
        type="text"
        placeholder="johndoe"
        error={errors.username?.message}
        helperText="Tên duy nhất (chữ thường, số, gạch dưới)"
        required
        {...register('username')}
      />

      {/* Full Name */}
      <Input
        label="Họ và tên"
        type="text"
        placeholder="Nguyễn Văn A"
        error={errors.fullName?.message}
        required
        {...register('fullName')}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="email.cua.ban@congty.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      {/* Department */}
      <Input
        label="Phòng ban"
        type="text"
        placeholder="IT, Nhân sự, Kinh doanh, v.v."
        error={errors.department?.message}
        helperText="Tùy chọn - Phòng ban hoặc nhóm của bạn"
        {...register('department')}
      />

      {/* Password */}
      <div className="relative">
        <Input
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          placeholder="Tạo mật khẩu mạnh"
          error={errors.password?.message}
          helperText="Tối thiểu 6 ký tự, 1 chữ hoa, 1 chữ thường, 1 số"
          required
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Input
          label="Xác nhận mật khẩu"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Nhập lại mật khẩu"
          error={errors.confirmPassword?.message}
          required
          {...register('confirmPassword')}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showConfirmPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start space-x-2">
        <Checkbox id="terms" required />
        <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
          Tôi đồng ý với{' '}
          <a href="#" className="text-[#0052CC] hover:underline">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="#" className="text-[#0052CC] hover:underline">
            Chính sách bảo mật
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
      >
        {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
      </Button>
    </form>
  );
}
