import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../api/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { LoginRequest, RegisterRequest } from '../types/auth.types';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setAuth, logout: logoutStore } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      console.log('[useAuth] Login response received (RAW):', JSON.stringify(data, null, 2));
      console.log('[useAuth] Login response keys:', Object.keys(data));
      console.log('[useAuth] Has user?', 'user' in data);
      console.log('[useAuth] data.user:', data.user);
      console.log('[useAuth] Type of data:', typeof data);
      
      if (!data.user) {
        console.error('[useAuth] ERROR: No user in response!');
        console.error('[useAuth] Full data object:', data);
        toast.error('Lỗi: Không nhận được thông tin người dùng');
        return;
      }
      
      if (!data.accessToken) {
        console.error('[useAuth] ERROR: Missing access token!');
        toast.error('Lỗi: Không nhận được token xác thực');
        return;
      }
      
      console.log('[useAuth] Login successful, setting auth state');
      // No refresh token anymore - simplified auth with 7-day access token
      setAuth(data.accessToken, data.accessToken, data.user); // Use accessToken for both
      toast.success('Đăng nhập thành công!');
      
      console.log('[useAuth] Redirecting to dashboard');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('[useAuth] Login failed', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      // No refresh token anymore - simplified auth with 7-day access token
      setAuth(data.accessToken, data.accessToken, data.user); // Use accessToken for both
      toast.success('Đăng ký thành công!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success('Đăng xuất thành công');
      router.push('/login');
    },
    onError: () => {
      // Still logout locally even if API call fails
      logoutStore();
      queryClient.clear();
      router.push('/login');
    },
  });

  // Get profile query
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: (() => {
      // Only enable if authenticated AND has valid token
      if (!isAuthenticated) return false;
      
      if (typeof window === 'undefined') return false;
      
      const accessToken = localStorage.getItem('accessToken');
      
      // Check token is valid (not null, undefined, or string 'undefined')
      const hasValidAccessToken = !!(accessToken && 
        accessToken !== 'undefined' && 
        accessToken !== 'null');
      
      return Boolean(hasValidAccessToken);
    })(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Handle profile error - logout if token is invalid (in useEffect to avoid setState during render)
  useEffect(() => {
    if (profileError && isAuthenticated) {
      console.log('[useAuth] Profile error detected, logging out');
      logoutStore();
      queryClient.clear();
    }
  }, [profileError, isAuthenticated, logoutStore, queryClient]);

  return {
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    isLoadingProfile,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    profile,
  };
}
