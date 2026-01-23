# Chuẩn hóa màu sắc và trạng thái Ticket

## 📋 Các trạng thái Ticket (6 trạng thái)

Theo định nghĩa trong `ticket.entity.ts`:

```typescript
export enum TicketStatus {
  NEW = 'New',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  PENDING = 'Pending',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}
```

## 🎨 Bảng màu chuẩn

| Trạng thái | Background Badge | Text Color | Dot/Border | Chart Color (Hex) | Ý nghĩa |
|-----------|------------------|------------|------------|-------------------|---------|
| **New** | `bg-blue-100` | `text-blue-700` | `bg-blue-500` | `#3B82F6` | Ticket mới tạo |
| **Assigned** | `bg-purple-100` | `text-purple-700` | `bg-purple-500` | `#8B5CF6` | Đã gán cho IT Staff |
| **In Progress** | `bg-orange-100` | `text-orange-700` | `bg-orange-500` | `#F59E0B` | Đang xử lý |
| **Pending** | `bg-yellow-100` | `text-yellow-700` | `bg-yellow-500` | `#EAB308` | Tạm dừng/chờ |
| **Resolved** | `bg-green-100` | `text-green-700` | `bg-green-500` | `#10B981` | Đã giải quyết |
| **Closed** | `bg-gray-100` | `text-gray-700` | `bg-gray-400` | `#6B7280` | Đã đóng |

## 📝 Backend API Format

Backend trả về format với lowercase và underscores:

```json
{
  "ticketsByStatus": {
    "new": 0,
    "assigned": 0,
    "in_progress": 0,
    "pending": 1,
    "resolved": 1,
    "closed": 1
  },
  "ticketsByPriority": {
    "high": 1,
    "medium": 2,
    "low": 0
  }
}
```

## 🔧 Files đã chuẩn hóa

### Backend
- ✅ `apps/backend/src/database/entities/ticket.entity.ts` - Enum definition
- ✅ `apps/backend/src/modules/reports/dto/dashboard-stats.dto.ts` - DTO với lowercase keys
- ✅ `apps/backend/src/modules/reports/reports.service.ts` - Transform data to lowercase

### Frontend - Type Definitions
- ✅ `apps/frontend/src/lib/types/ticket.types.ts` - TicketStatus enum
- ✅ `apps/frontend/src/lib/api/reports.service.ts` - DashboardStats interface (bao gồm pending)

### Frontend - Pages
- ✅ `apps/frontend/src/app/(dashboard)/dashboard/page.tsx` - Dashboard với 6 trạng thái
- ✅ `apps/frontend/src/app/(dashboard)/tickets/page.tsx` - Ticket list
- ✅ `apps/frontend/src/app/(dashboard)/tickets/[id]/page.tsx` - Ticket detail
- ✅ `apps/frontend/src/app/(dashboard)/reports/page.tsx` - Reports page
- ✅ `apps/frontend/src/app/(dashboard)/users/[id]/page.tsx` - User detail

### Frontend - Components
- ✅ `apps/frontend/src/components/calendar/TicketCalendar.tsx` - Calendar view

## ⚠️ Lưu ý quan trọng

1. **Luôn dùng "In Progress"** (có space) chứ không phải "In_Progress" (underscore)
2. **Backend API keys** dùng lowercase với underscore: `in_progress`
3. **Frontend display** dùng PascalCase với space: `In Progress`
4. **Màu sắc phải nhất quán** trên tất cả các trang và components
5. **Đầy đủ 6 trạng thái** - không được thiếu Pending

## 🧪 Testing

Chạy test để verify backend API:
```bash
node test-dashboard-api.js
```

Expected output:
```json
{
  "ticketsByStatus": {
    "new": 0,
    "assigned": 0,
    "in_progress": 0,
    "pending": 1,
    "resolved": 1,
    "closed": 1
  }
}
```
