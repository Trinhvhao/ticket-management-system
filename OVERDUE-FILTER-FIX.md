# ✅ Fix Filter "Quá hạn" (Overdue Tickets)

**Ngày fix**: 25/01/2026  
**Vấn đề**: Filter "Quá hạn SLA" và "Sắp quá hạn" không hoạt động

---

## 🐛 Vấn đề phát hiện

Filter "Quá hạn SLA" (`slaBreached`) và "Sắp quá hạn" (`slaAtRisk`) đã được:
- ✅ Định nghĩa trong QuickFilters component
- ✅ Có logic xử lý trong backend (tickets.service.ts)
- ✅ Có type definition trong TicketFilters interface

**NHƯNG**: Các filter này **KHÔNG được gửi lên backend** khi gọi API!

---

## 🔧 Nguyên nhân

Trong file `apps/frontend/src/lib/api/tickets.service.ts`, hàm `getAll()` thiếu code để append các filter SLA vào query params:

```typescript
// ❌ TRƯỚC ĐÂY - Thiếu SLA filters
if (filters.search) params.append('search', filters.search);
if (filters.page) params.append('page', String(filters.page));
// ... không có slaBreached và slaAtRisk
```

---

## ✅ Giải pháp

Thêm code để gửi SLA filters lên backend:

```typescript
// ✅ SAU KHI FIX
if (filters.search) params.append('search', filters.search);

// SLA filters
if (filters.slaBreached) params.append('slaBreached', 'true');
if (filters.slaAtRisk) params.append('slaAtRisk', 'true');

if (filters.page) params.append('page', String(filters.page));
```

---

## 📋 Chi tiết thay đổi

### File: `apps/frontend/src/lib/api/tickets.service.ts`

**Dòng thêm vào** (sau dòng `if (filters.search)`):

```typescript
// SLA filters
if (filters.slaBreached) params.append('slaBreached', 'true');
if (filters.slaAtRisk) params.append('slaAtRisk', 'true');
```

---

## 🎯 Cách hoạt động

### 1. **Backend Logic** (đã có sẵn)

File: `apps/backend/src/modules/tickets/tickets.service.ts`

```typescript
// SLA filters
const now = new Date();
if (filters.slaBreached) {
  // Tickets đã quá hạn và chưa resolved/closed
  where.dueDate = { [Op.lt]: now };
  where.status = { [Op.notIn]: [TicketStatus.RESOLVED, TicketStatus.CLOSED] };
}
if (filters.slaAtRisk) {
  // Tickets sẽ quá hạn trong 2 giờ tới
  const riskThreshold = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  where.dueDate = { [Op.between]: [now, riskThreshold] };
  where.status = { [Op.notIn]: [TicketStatus.RESOLVED, TicketStatus.CLOSED] };
}
```

### 2. **Frontend QuickFilters** (đã có sẵn)

File: `apps/frontend/src/components/tickets/QuickFilters.tsx`

```typescript
{
  id: 'sla-breached',
  label: 'Quá hạn SLA',
  icon: <AlertCircle className="w-4 h-4" />,
  filters: { slaBreached: true },
  roles: [UserRole.IT_STAFF, UserRole.ADMIN],
},
{
  id: 'sla-at-risk',
  label: 'Sắp quá hạn',
  icon: <Clock className="w-4 h-4" />,
  filters: { slaAtRisk: true },
  roles: [UserRole.IT_STAFF, UserRole.ADMIN],
}
```

### 3. **API Call** (đã fix)

Khi user click "Quá hạn SLA", frontend sẽ gọi:

```
GET /api/v1/tickets?slaBreached=true&page=1&limit=10
```

Backend sẽ trả về các tickets:
- `dueDate < now` (đã quá hạn)
- `status NOT IN ('Resolved', 'Closed')` (chưa giải quyết)

---

## 🧪 Test

### Cách test filter "Quá hạn":

1. **Tạo ticket test**:
   - Tạo ticket mới
   - Set `dueDate` về quá khứ (ví dụ: hôm qua)
   - Status: "In Progress" hoặc "Assigned"

2. **Click filter "Quá hạn SLA"**:
   - Vào trang Tickets
   - Click button "Quá hạn SLA"
   - Ticket test phải xuất hiện trong danh sách

3. **Kiểm tra API call**:
   - Mở DevTools → Network tab
   - Click filter "Quá hạn SLA"
   - Xem request: `/api/v1/tickets?slaBreached=true`

---

## 📊 Kết quả

✅ **Frontend build**: Thành công, không lỗi  
✅ **Filter "Quá hạn SLA"**: Hoạt động đúng  
✅ **Filter "Sắp quá hạn"**: Hoạt động đúng  
✅ **API params**: Được gửi đầy đủ lên backend  

---

## 🔄 Các filter SLA khác

Hệ thống hỗ trợ 2 loại filter SLA:

### 1. **Quá hạn SLA** (`slaBreached: true`)
- Tickets đã quá `dueDate`
- Chưa được resolved/closed
- Hiển thị với badge đỏ "⚠️ Quá hạn"

### 2. **Sắp quá hạn** (`slaAtRisk: true`)
- Tickets sẽ quá hạn trong 2 giờ tới
- Chưa được resolved/closed
- Cảnh báo sớm để IT Staff xử lý kịp thời

---

## 📝 Lưu ý

- Chỉ **IT Staff** và **Admin** mới thấy các filter SLA này
- Employee không thấy vì không cần quan tâm đến SLA
- SLA được tính dựa trên `priority` của ticket:
  - High: 4 giờ
  - Medium: 8 giờ
  - Low: 24 giờ

---

**Status**: ✅ FIXED
