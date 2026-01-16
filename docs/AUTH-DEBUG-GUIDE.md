# Hướng dẫn Debug Vấn đề Authentication

## Vấn đề hiện tại

**Triệu chứng:** Sau khoảng 15 phút, hệ thống không tự động chuyển về trang login mà các chức năng bị lỗi, dữ liệu không hiển thị.

**Nguyên nhân có thể:**
1. Access token hết hạn (15 phút) nhưng refresh token không hoạt động
2. Supabase/Database connection timeout
3. Token refresh logic bị lỗi
4. Auth store bị clear không đúng lúc
5. Browser storage bị xóa

## Công cụ Debug đã tích hợp

### 1. Auth Logger

Tự động log tất cả events liên quan đến authentication:

**Categories:**
- `API_CLIENT` - API client initialization
- `API_REQUEST` - Mọi API request (có token hay không)
- `API_RESPONSE` - Response errors (đặc biệt 401)
- `TOKEN_REFRESH` - Quá trình refresh token
- `AUTH_STORE` - Auth state changes
- `AUTH_LOGOUT` - Logout events

**Log Levels:**
- `info` ℹ️ - Thông tin bình thường
- `warn` ⚠️ - Cảnh báo
- `error` ❌ - Lỗi
- `debug` 🔍 - Chi tiết debug

### 2. Auth Debug Panel (UI)

Floating button màu tím ở góc dưới bên phải (chỉ hiện ở development mode).

**Features:**
- Real-time token status
- View all logs với filter
- Export logs to JSON
- Clear logs
- Token expiry countdown

### 3. Console Commands

Mở browser console và sử dụng:

```javascript
// View all logs
authLogger.getLogs()

// View summary
authLogger.printSummary()

// Export logs to file
authLogger.exportLogs()

// Clear logs
authLogger.clearLogs()

// Filter logs
authLogger.getLogs({ level: 'error' })
authLogger.getLogs({ category: 'TOKEN_REFRESH' })
authLogger.getLogs({ since: new Date(Date.now() - 3600000) }) // Last hour
```

## Các bước Debug

### Bước 1: Bật Debug Panel

1. Đăng nhập vào hệ thống
2. Nhìn góc dưới bên phải, click vào button tím 🔍
3. Panel sẽ hiện ra với token status

### Bước 2: Theo dõi Token Status

Panel hiển thị:
- ✅ **Valid for Xm** (màu xanh) - Token còn hạn
- ⚠️ **Expires in Xm** (màu cam) - Token sắp hết hạn (< 5 phút)
- ❌ **Access token expired** (màu đỏ) - Token đã hết hạn
- ❌ **No tokens** (màu đỏ) - Không có token

### Bước 3: Đợi 15 phút và quan sát

**Kịch bản bình thường:**
1. Sau 15 phút, access token hết hạn
2. Khi có API call tiếp theo, sẽ nhận 401
3. System tự động gọi `/auth/refresh`
4. Nhận access token mới
5. Retry request ban đầu
6. Mọi thứ hoạt động bình thường

**Logs mong đợi:**
```
⚠️ [API_RESPONSE] 401 Unauthorized received
ℹ️ [TOKEN_REFRESH] Starting token refresh process
🔍 [TOKEN_REFRESH] Checking refresh token
ℹ️ [TOKEN_REFRESH] Calling /auth/refresh endpoint
ℹ️ [TOKEN_REFRESH] Successfully refreshed access token
🔍 [TOKEN_REFRESH] Token refresh process completed
```

**Kịch bản lỗi - Refresh token hết hạn:**
```
⚠️ [API_RESPONSE] 401 Unauthorized received
ℹ️ [TOKEN_REFRESH] Starting token refresh process
🔍 [TOKEN_REFRESH] Checking refresh token
ℹ️ [TOKEN_REFRESH] Calling /auth/refresh endpoint
❌ [TOKEN_REFRESH] Token refresh failed
⚠️ [AUTH_LOGOUT] Tokens cleared, dispatching logout event
⚠️ [AUTH_STORE] Logout event received from API client
⚠️ [AUTH_STORE] logout called - clearing all auth data
ℹ️ [AUTH_LOGOUT] Redirecting to login page
```

**Kịch bản lỗi - Refresh token bị xóa:**
```
⚠️ [API_RESPONSE] 401 Unauthorized received
ℹ️ [TOKEN_REFRESH] Starting token refresh process
🔍 [TOKEN_REFRESH] Checking refresh token
❌ [TOKEN_REFRESH] No valid refresh token found
```

### Bước 4: Kiểm tra Logs

Trong Debug Panel:
1. Click **Refresh** để cập nhật logs
2. Filter theo level: **Error** hoặc **Warn**
3. Tìm logs liên quan đến `TOKEN_REFRESH`
4. Xem chi tiết data (click "Data" để expand)

### Bước 5: Export Logs

Nếu vấn đề vẫn tiếp diễn:
1. Click **Export** trong Debug Panel
2. File JSON sẽ được download
3. Gửi file này để phân tích

## Các vấn đề thường gặp

### 1. Refresh Token hết hạn sớm

**Triệu chứng:**
```
❌ [TOKEN_REFRESH] Token refresh failed
status: 401
data: { message: "Invalid refresh token" }
```

**Nguyên nhân:** Backend JWT secret bị thay đổi hoặc refresh token expiry quá ngắn

**Kiểm tra:**
```bash
# Backend .env
JWT_SECRET=your-secret-here  # Không được thay đổi
```

**Giải pháp:** 
- Đảm bảo JWT_SECRET không thay đổi
- Kiểm tra `auth.service.ts` - refresh token expiry phải là `7d`

### 2. Tokens bị xóa khỏi localStorage

**Triệu chứng:**
```
❌ [TOKEN_REFRESH] No valid refresh token found
```

**Nguyên nhân có thể:**
- Browser clear storage on exit
- Extension xóa cookies/storage
- Private/Incognito mode
- Multiple tabs conflict

**Kiểm tra:**
```javascript
// Console
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')
```

**Giải pháp:**
- Disable browser "Clear cookies on exit"
- Disable privacy extensions
- Không dùng Incognito mode
- Chỉ đăng nhập 1 tab

### 3. Token validation failed trong Auth Store

**Triệu chứng:**
```
⚠️ [AUTH_STORE] Token validation FAILED - logging out
reason: "AccessToken mismatch"
```

**Nguyên nhân:** Tokens trong localStorage không khớp với Zustand store

**Có thể do:**
- Multiple tabs đăng nhập/đăng xuất
- Race condition khi refresh token
- Storage sync issues

**Giải pháp:**
- Chỉ mở 1 tab
- Clear browser cache và login lại

### 4. Supabase Connection Timeout

**Triệu chứng:**
```
❌ [TOKEN_REFRESH] Token refresh failed
error: "timeout of 10000ms exceeded"
```

**Nguyên nhân:** Backend không phản hồi trong 10 giây

**Kiểm tra:**
- Backend có đang chạy không?
- Database connection có OK không?
- Network có vấn đề không?

**Giải pháp:**
- Restart backend
- Check database connection
- Check network

### 5. CORS Issues

**Triệu chứng:**
```
❌ [TOKEN_REFRESH] Token refresh failed
error: "Network Error"
```

**Nguyên nhân:** CORS policy blocking request

**Kiểm tra Backend:**
```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true,
});
```

## Test Cases

### Test 1: Token Refresh sau 15 phút

1. Đăng nhập
2. Mở Debug Panel
3. Đợi 15 phút (hoặc đổi expiry thành 1m để test nhanh)
4. Thực hiện action (load tickets, etc)
5. Quan sát logs - phải thấy "Successfully refreshed access token"

### Test 2: Refresh Token hết hạn

1. Đăng nhập
2. Đợi 7 ngày (hoặc đổi expiry thành 5m để test)
3. Thực hiện action
4. Phải tự động redirect về login

### Test 3: Multiple Tabs

1. Mở 2 tabs cùng đăng nhập
2. Đăng xuất ở tab 1
3. Tab 2 phải tự động logout
4. Logs phải show "Logout event received"

### Test 4: Browser Restart

1. Đăng nhập
2. Đóng browser hoàn toàn
3. Mở lại browser
4. Vào lại app
5. Phải vẫn đăng nhập (nếu chưa hết 7 ngày)

## Monitoring trong Production

Để monitor trong production, có thể:

1. **Sentry Integration** - Track errors
2. **LogRocket** - Session replay
3. **Custom Analytics** - Track logout events

```typescript
// Example: Track logout events
authLogger.info('ANALYTICS', 'User logged out', {
  userId: user.id,
  reason: 'token_expired',
  lastActivity: Date.now(),
});
```

## Liên hệ Support

Nếu vấn đề vẫn tiếp diễn, cung cấp:

1. ✅ Exported logs (JSON file)
2. ✅ Screenshot của Debug Panel
3. ✅ Browser và version
4. ✅ Thời gian xảy ra vấn đề
5. ✅ Các bước tái hiện

## Files liên quan

- `apps/frontend/src/lib/utils/auth-logger.ts` - Logger utility
- `apps/frontend/src/components/debug/AuthDebugPanel.tsx` - Debug UI
- `apps/frontend/src/lib/api/client.ts` - Token refresh logic
- `apps/frontend/src/lib/stores/auth.store.ts` - Auth state
- `apps/backend/src/modules/auth/auth.service.ts` - Token generation
- `apps/backend/src/modules/auth/auth.module.ts` - JWT config

---

**Tạo bởi:** Kiro AI  
**Ngày:** 16/01/2026  
**Version:** 1.0
