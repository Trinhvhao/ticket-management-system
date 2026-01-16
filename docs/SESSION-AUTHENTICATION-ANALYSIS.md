# Phân Tích Cơ Chế Session & Authentication

## 📋 Tổng Quan

Hệ thống sử dụng **JWT (JSON Web Token)** với cơ chế **Access Token + Refresh Token** để quản lý authentication.

---

## 🔑 Cơ Chế Hoạt Động

### 1. Token Types

#### Access Token
- **Thời gian sống:** 15 phút
- **Mục đích:** Xác thực các API requests
- **Lưu trữ:** localStorage (`accessToken`)
- **Payload:**
  ```json
  {
    "sub": 123,           // User ID
    "email": "user@example.com",
    "role": "Employee",
    "iat": 1234567890,    // Issued at
    "exp": 1234568790     // Expires at (15 min later)
  }
  ```

#### Refresh Token
- **Thời gian sống:** 7 ngày
- **Mục đích:** Làm mới access token khi hết hạn
- **Lưu trữ:** localStorage (`refreshToken`)
- **Payload:** Giống access token nhưng exp khác

---

## ⏰ Timeline Session

### Khi User Login
```
1. User nhập email/password
2. Backend verify credentials
3. Backend tạo 2 tokens:
   - Access Token (15 min)
   - Refresh Token (7 days)
4. Frontend lưu vào localStorage
5. User có thể sử dụng hệ thống
```

### Trong 15 Phút Đầu
```
✅ Access Token còn hạn
- Mọi API request đều thành công
- Header: Authorization: Bearer <accessToken>
- Backend verify token → OK → Trả data
```

### Sau 15 Phút (Access Token Hết Hạn)
```
❌ Access Token hết hạn
1. User gọi API → Backend trả 401 Unauthorized
2. Frontend interceptor bắt 401:
   a. Gọi /auth/refresh với refreshToken
   b. Backend verify refreshToken
   c. Nếu OK → Tạo accessToken mới (15 min)
   d. Frontend lưu accessToken mới
   e. Retry request ban đầu với token mới
3. ✅ Request thành công

⚠️ Quá trình này TRANSPARENT với user
   User không biết token đã được refresh
```

### Sau 7 Ngày (Refresh Token Hết Hạn)
```
❌ Cả 2 tokens đều hết hạn
1. User gọi API → 401
2. Frontend thử refresh → 401 (refresh token hết hạn)
3. Frontend:
   - Clear localStorage (accessToken, refreshToken)
   - Dispatch event 'auth:logout'
   - Redirect về /login
4. ❌ User BỊ LOGOUT - Phải đăng nhập lại
```

---

## 🔄 Flow Chart

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ Get Access (15m) +      │
│ Refresh Token (7d)      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Use System Normally    │
│  (0-15 minutes)         │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Access Token Expires    │
│ (After 15 minutes)      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Auto Refresh Token      │
│ Get New Access (15m)    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Continue Using          │
│ (Repeat every 15 min)   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ After 7 Days            │
│ Refresh Token Expires   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ FORCED LOGOUT           │
│ Must Login Again        │
└─────────────────────────┘
```

---

## 🎯 Khi Nào User Bị Logout?

### 1. ✅ Logout Chủ Động
```
User click "Logout" button
→ Frontend clear tokens
→ Redirect to /login
```

### 2. ❌ Logout Tự Động (Forced)

#### Scenario A: Refresh Token Hết Hạn (7 ngày)
```
Thời điểm: Sau 7 ngày kể từ lần login cuối
Nguyên nhân: Refresh token expired
Hành động:
  1. API call → 401
  2. Try refresh → 401 (refresh token invalid)
  3. Clear tokens
  4. Redirect to /login
```

#### Scenario B: User Inactive Quá Lâu
```
Thời điểm: Không dùng hệ thống > 7 ngày
Nguyên nhân: Refresh token expired do không activity
Hành động: Giống Scenario A
```

#### Scenario C: Token Bị Xóa/Corrupt
```
Thời điểm: Bất kỳ lúc nào
Nguyên nhân:
  - User clear browser cache/localStorage
  - Browser privacy mode
  - Manual delete tokens
Hành động:
  1. API call → 401 (no token)
  2. Redirect to /login
```

#### Scenario D: Account Bị Deactivate
```
Thời điểm: Admin deactivate account
Nguyên nhân: User.isActive = false
Hành động:
  1. API call → 401 (user not active)
  2. Refresh fails → 401
  3. Forced logout
```

---

## 🛡️ Security Features

### 1. Short-Lived Access Token (15 min)
**Lý do:**
- Giảm thiểu rủi ro nếu token bị đánh cắp
- Attacker chỉ có 15 phút để exploit
- Sau 15 phút token tự động invalid

### 2. Long-Lived Refresh Token (7 days)
**Lý do:**
- User experience tốt hơn
- Không phải login lại mỗi 15 phút
- Vẫn đủ ngắn để đảm bảo security

### 3. Token Refresh Mechanism
**Lý do:**
- Transparent với user
- Tự động renew access token
- User không bị interrupt

### 4. Stateless Authentication
**Lý do:**
- Không cần lưu session trên server
- Scalable (multiple servers)
- JWT self-contained

---

## 📊 Current Configuration

### Backend (.env)
```env
JWT_SECRET=your-secret-key
# Access token: 15m (hardcoded in auth.service.ts)
# Refresh token: 7d (hardcoded in auth.service.ts)
```

### Frontend (localStorage)
```javascript
localStorage.setItem('accessToken', '...')   // 15 min
localStorage.setItem('refreshToken', '...')  // 7 days
```

---

## 🔧 Cách Thay Đổi Thời Gian Session

### Tăng Access Token Lifetime (Không khuyến nghị)
```typescript
// apps/backend/src/modules/auth/auth.service.ts
private async generateTokens(user: User) {
  const accessToken = await this.jwtService.signAsync(payload, {
    expiresIn: '1h', // Thay đổi từ 15m → 1h
  });
  // ...
}
```

**⚠️ Rủi ro:**
- Token bị đánh cắp có thời gian exploit lâu hơn
- Kém security hơn

### Tăng Refresh Token Lifetime
```typescript
// apps/backend/src/modules/auth/auth.service.ts
private async generateTokens(user: User) {
  const refreshToken = await this.jwtService.signAsync(payload, {
    expiresIn: '30d', // Thay đổi từ 7d → 30d
  });
  // ...
}
```

**✅ An toàn hơn:**
- User không phải login lại trong 30 ngày
- Access token vẫn ngắn (15m)

### Khuyến Nghị Production
```typescript
// Optimal configuration
accessToken: '15m'   // Giữ nguyên
refreshToken: '30d'  // Tăng lên 30 ngày cho UX tốt hơn
```

---

## 🐛 Troubleshooting

### Issue 1: User Bị Logout Liên Tục
**Nguyên nhân:**
- Refresh token không được lưu đúng
- Refresh endpoint không hoạt động

**Kiểm tra:**
```javascript
// Check localStorage
console.log(localStorage.getItem('accessToken'));
console.log(localStorage.getItem('refreshToken'));

// Check refresh endpoint
POST /api/v1/auth/refresh
Body: { "refreshToken": "..." }
```

### Issue 2: 401 Errors Spam
**Nguyên nhân:**
- Multiple API calls cùng lúc khi token expired
- Refresh mechanism không queue requests

**Giải pháp:**
✅ Đã implement trong `apps/frontend/src/lib/api/client.ts`:
- Queue failed requests khi refreshing
- Retry sau khi có token mới
- Skip non-critical endpoints khi logged out

### Issue 3: Token Không Tự Động Refresh
**Nguyên nhân:**
- Interceptor không hoạt động
- Refresh token đã hết hạn

**Kiểm tra:**
```javascript
// Check token expiry
const token = localStorage.getItem('accessToken');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(decoded.exp * 1000));
console.log('Now:', new Date());
```

---

## 📈 Monitoring & Metrics

### Metrics Nên Track
1. **Token Refresh Rate**
   - Số lần refresh/hour
   - Thành công vs thất bại

2. **Session Duration**
   - Thời gian trung bình user active
   - Phân bố session length

3. **Forced Logout Rate**
   - % users bị logout tự động
   - Nguyên nhân (token expired, account disabled, etc)

4. **Token Theft Detection**
   - Multiple IPs cùng token
   - Unusual access patterns

---

## 🎓 Best Practices

### ✅ DO
1. Keep access token short (15-30 min)
2. Use refresh token for better UX
3. Implement token refresh queue
4. Clear tokens on logout
5. Validate token on every request
6. Use HTTPS in production

### ❌ DON'T
1. Store tokens in cookies (XSS risk)
2. Make access token too long (>1h)
3. Skip token validation
4. Expose JWT secret
5. Use same secret for all environments

---

## 🔮 Future Improvements

### 1. Token Blacklist
```typescript
// Blacklist tokens on logout
await redis.set(`blacklist:${token}`, '1', 'EX', 900); // 15 min
```

### 2. Sliding Session
```typescript
// Extend session on activity
if (lastActivity < 5 minutes ago) {
  extendRefreshToken();
}
```

### 3. Remember Me
```typescript
// Longer refresh token if user checks "Remember Me"
const refreshExpiry = rememberMe ? '90d' : '7d';
```

### 4. Multi-Device Management
```typescript
// Track active sessions per user
// Allow user to revoke specific devices
```

---

## 📝 Summary

| Aspect | Current Value | Khi Nào Logout |
|--------|---------------|----------------|
| Access Token | 15 minutes | Tự động refresh (transparent) |
| Refresh Token | 7 days | **FORCED LOGOUT** |
| Inactivity | N/A | Sau 7 ngày không dùng |
| Manual Logout | Anytime | User click logout |
| Account Disabled | Anytime | Admin deactivate |

**Kết luận:**
- User chỉ bị logout khi:
  1. Không dùng hệ thống > 7 ngày
  2. Click logout button
  3. Account bị disable
  4. Clear browser data
- Trong 7 ngày, token tự động refresh mỗi 15 phút
- User experience mượt mà, không bị interrupt

---

*Document Version: 1.0*  
*Last Updated: January 16, 2026*  
*Author: System Analysis*
