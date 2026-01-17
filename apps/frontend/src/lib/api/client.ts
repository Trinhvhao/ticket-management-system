import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';
import { authLogger } from '../utils/auth-logger';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

authLogger.info('API_CLIENT', 'API Client initialized', {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      authLogger.debug('API_REQUEST', `${config.method?.toUpperCase()} ${config.url}`, {
        hasToken: true,
        tokenPreview: token.substring(0, 20) + '...',
      });
    } else {
      authLogger.warn('API_REQUEST', `${config.method?.toUpperCase()} ${config.url} - NO TOKEN`);
    }
    return config;
  },
  (error: AxiosError) => {
    authLogger.error('API_REQUEST', 'Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Unwrap the data from backend's standard response format
    // Backend returns: { success, data, message, timestamp, path }
    // We want to return just the data property
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      authLogger.warn('API_RESPONSE', '401 Unauthorized received', {
        url: originalRequest.url,
        hasAccessToken: !!localStorage.getItem('accessToken'),
        hasRefreshToken: !!localStorage.getItem('refreshToken'),
      });

      // Skip retry for auth endpoints to prevent infinite loop
      if (originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/refresh')) {
        authLogger.info('API_RESPONSE', 'Skipping retry for auth endpoint');
        return Promise.reject(error);
      }

      // Skip retry for non-critical endpoints (notifications, etc) if already logged out
      const isLoggedOut = !localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken');
      const isNonCriticalEndpoint = originalRequest.url?.includes('/notifications') || 
                                     originalRequest.url?.includes('/reports/action-required');
      
      if (isLoggedOut && isNonCriticalEndpoint) {
        authLogger.debug('API_RESPONSE', 'Silently failing non-critical endpoint (already logged out)');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        authLogger.debug('TOKEN_REFRESH', 'Already refreshing, queuing request');
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            authLogger.debug('TOKEN_REFRESH', 'Retrying queued request with new token');
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      authLogger.info('TOKEN_REFRESH', 'Starting token refresh process');

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        authLogger.debug('TOKEN_REFRESH', 'Checking refresh token', {
          hasRefreshToken: !!refreshToken,
          refreshTokenPreview: refreshToken ? refreshToken.substring(0, 20) + '...' : 'none',
        });

        // Check if refresh token exists and is valid
        if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
          authLogger.error('TOKEN_REFRESH', 'No valid refresh token found');
          throw new Error('No refresh token');
        }

        authLogger.info('TOKEN_REFRESH', 'Calling /auth/refresh endpoint');

        // Try to refresh token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        
        authLogger.info('TOKEN_REFRESH', 'Successfully refreshed access token', {
          newTokenPreview: accessToken.substring(0, 20) + '...',
        });

        localStorage.setItem('accessToken', accessToken);

        processQueue(null, accessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed, logout user
        authLogger.error('TOKEN_REFRESH', 'Token refresh failed', {
          error: refreshError.message,
          status: refreshError.response?.status,
          data: refreshError.response?.data,
        });

        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        authLogger.warn('AUTH_LOGOUT', 'Tokens cleared, dispatching logout event');

        // Clear auth store
        if (typeof window !== 'undefined') {
          // Dispatch custom event to clear auth store
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        
        // Only redirect if not already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          authLogger.info('AUTH_LOGOUT', 'Redirecting to login page');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        authLogger.debug('TOKEN_REFRESH', 'Token refresh process completed');
      }
    }

    // Handle other errors
    const errorMessage = (error.response?.data as any)?.message || error.message || 'An error occurred';
    
    // Don't show toast for 401 (handled above) or if on login/register page
    if (error.response?.status !== 401 && 
        typeof window !== 'undefined' && 
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
