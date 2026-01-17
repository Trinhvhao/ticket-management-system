/**
 * Debug utility to check authentication status and token validity
 */

export const debugAuth = () => {
  console.group('🔍 Auth Debug Info');
  
  // 1. Check if tokens exist
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  console.log('📦 Tokens in localStorage:');
  console.log('  Access Token:', accessToken ? '✅ Exists' : '❌ Missing');
  console.log('  Refresh Token:', refreshToken ? '✅ Exists' : '❌ Missing');
  
  if (!accessToken || !refreshToken) {
    console.error('❌ Tokens missing! This is why you got logged out.');
    console.groupEnd();
    return;
  }
  
  // 2. Decode and check expiry
  try {
    const decodeToken = (token: string) => {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    };
    
    const accessPayload = decodeToken(accessToken);
    const refreshPayload = decodeToken(refreshToken);
    
    const now = Math.floor(Date.now() / 1000);
    const accessExpiry = accessPayload.exp;
    const refreshExpiry = refreshPayload.exp;
    
    const accessTimeLeft = accessExpiry - now;
    const refreshTimeLeft = refreshExpiry - now;
    
    console.log('\n⏰ Access Token:');
    console.log('  Issued:', new Date(accessPayload.iat * 1000).toLocaleString());
    console.log('  Expires:', new Date(accessExpiry * 1000).toLocaleString());
    console.log('  Time left:', formatTime(accessTimeLeft));
    console.log('  Status:', accessTimeLeft > 0 ? '✅ Valid' : '❌ Expired');
    
    console.log('\n⏰ Refresh Token:');
    console.log('  Issued:', new Date(refreshPayload.iat * 1000).toLocaleString());
    console.log('  Expires:', new Date(refreshExpiry * 1000).toLocaleString());
    console.log('  Time left:', formatTime(refreshTimeLeft));
    console.log('  Status:', refreshTimeLeft > 0 ? '✅ Valid' : '❌ Expired');
    
    console.log('\n👤 User Info:');
    console.log('  ID:', accessPayload.sub);
    console.log('  Email:', accessPayload.email);
    console.log('  Role:', accessPayload.role);
    
    // 3. Check for issues
    console.log('\n🔍 Potential Issues:');
    
    if (refreshTimeLeft < 0) {
      console.error('  ❌ REFRESH TOKEN EXPIRED - This is why you got logged out!');
      console.error('     Token expired:', Math.abs(refreshTimeLeft), 'seconds ago');
    } else if (refreshTimeLeft < 86400) { // Less than 1 day
      console.warn('  ⚠️  Refresh token expires soon (< 1 day)');
    }
    
    if (accessTimeLeft < 0 && refreshTimeLeft > 0) {
      console.log('  ℹ️  Access token expired but refresh token valid');
      console.log('     System should auto-refresh on next API call');
    }
    
    // 4. Check browser storage
    console.log('\n💾 Browser Storage:');
    console.log('  localStorage available:', typeof localStorage !== 'undefined');
    console.log('  sessionStorage available:', typeof sessionStorage !== 'undefined');
    
    // 5. Check if in incognito/private mode
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      console.log('  Private mode:', '❌ No (normal mode)');
    } catch (e) {
      console.warn('  Private mode:', '⚠️  Possibly yes (storage restricted)');
    }
    
  } catch (error) {
    console.error('❌ Error decoding tokens:', error);
    console.error('   Tokens might be corrupted!');
  }
  
  console.groupEnd();
};

const formatTime = (seconds: number): string => {
  if (seconds < 0) {
    return `Expired ${Math.abs(seconds)} seconds ago`;
  }
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

// Auto-check on page load in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Make it available globally
  (window as any).debugAuth = debugAuth;
  console.log('💡 Tip: Run debugAuth() in console to check auth status');
}

export default debugAuth;
