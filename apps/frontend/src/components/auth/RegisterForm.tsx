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
        label="Username"
        type="text"
        placeholder="johndoe"
        error={errors.username?.message}
        helperText="Unique username (lowercase, alphanumeric, underscore)"
        required
        {...register('username')}
      />

      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        error={errors.fullName?.message}
        required
        {...register('fullName')}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="your.email@company.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      {/* Department */}
      <Input
        label="Department"
        type="text"
        placeholder="IT, HR, Sales, etc."
        error={errors.department?.message}
        helperText="Optional - Your department or team"
        {...register('department')}
      />

      {/* Password */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a strong password"
          error={errors.password?.message}
          helperText="Min 6 characters, 1 uppercase, 1 lowercase, 1 number"
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
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter your password"
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
          I agree to the{' '}
          <a href="#" className="text-[#0052CC] hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#0052CC] hover:underline">
            Privacy Policy
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
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}
