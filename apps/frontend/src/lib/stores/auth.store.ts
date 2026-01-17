import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth.types';
import { authLogger } from '../utils/auth-logger';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (accessToken, refreshToken, user) => {
        authLogger.info('AUTH_STORE', 'setAuth called', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasUser: !!user,
          userName: user?.fullName,
          userRole: user?.role,
        });
        
        // Store tokens in localStorage for API client
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          authLogger.debug('AUTH_STORE', 'Tokens saved to localStorage');
        }
        
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        });
        
        authLogger.info('AUTH_STORE', 'Auth state updated successfully');
      },

      setUser: (user) => {
        authLogger.debug('AUTH_STORE', 'setUser called', { userName: user?.fullName });
        set({ user });
      },

      logout: () => {
        authLogger.warn('AUTH_STORE', 'logout called - clearing all auth data');
        
        // Clear tokens from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          authLogger.debug('AUTH_STORE', 'Tokens removed from localStorage');
        }
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        
        authLogger.info('AUTH_STORE', 'Auth state cleared, user logged out');
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // Rehydrate and validate tokens on load
      onRehydrateStorage: () => (state) => {
        authLogger.info('AUTH_STORE', 'Rehydrating auth state from storage');
        
        if (state && typeof window !== 'undefined') {
          // Check if tokens exist in localStorage
          const accessToken = localStorage.getItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');
          
          authLogger.debug('AUTH_STORE', 'Token validation check', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            storeHasAccessToken: !!state.accessToken,
            storeHasRefreshToken: !!state.refreshToken,
            storeIsAuthenticated: state.isAuthenticated,
            storeUser: state.user?.fullName,
          });
          
          // If tokens don't match or are missing, clear auth state
          if (!accessToken || !refreshToken || 
              accessToken === 'undefined' || accessToken === 'null' ||
              refreshToken === 'undefined' || refreshToken === 'null' ||
              accessToken !== state.accessToken || 
              refreshToken !== state.refreshToken) {
            authLogger.warn('AUTH_STORE', 'Token validation FAILED - logging out', {
              reason: !accessToken ? 'No accessToken in localStorage' :
                      !refreshToken ? 'No refreshToken in localStorage' :
                      accessToken !== state.accessToken ? 'AccessToken mismatch' :
                      refreshToken !== state.refreshToken ? 'RefreshToken mismatch' :
                      'Invalid token value',
            });
            state.logout();
          } else {
            authLogger.info('AUTH_STORE', 'Token validation PASSED - user authenticated');
          }
          
          // Listen for logout events from API client (only once)
          const handleLogout = () => {
            authLogger.warn('AUTH_STORE', 'Logout event received from API client');
            const currentState = useAuthStore.getState();
            currentState.logout();
          };
          
          // Remove existing listener if any
          window.removeEventListener('auth:logout', handleLogout);
          // Add new listener
          window.addEventListener('auth:logout', handleLogout);
          
          authLogger.debug('AUTH_STORE', 'Logout event listener registered');
        }
      },
    }
  )
);
