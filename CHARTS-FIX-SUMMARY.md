# ✅ Sửa lỗi Charts - Trend & SLA

## 🐛 Vấn đề phát hiện

### 1. Trend Chart - Không có dữ liệu
**Nguyên nhân**: Backend trả về field names khác với frontend expect
- Backend: `ticketsCreated`, `ticketsResolved`, `ticketsClosed`
- Frontend: `created`, `resolved`, `closed`

### 2. SLA Gauge - Dữ liệu fake
**Nguyên nhân**: Backend không trả về `slaBreached` và `slaAtRisk`
- Frontend dùng fallback values: `|| 85`, `|| 3`, hardcoded `5`

## ✅ Giải pháp đã áp dụng

### 1. Fix Trend Chart

#### Frontend (`apps/frontend/src/app/(dashboard)/dashboard/page.tsx`)
```typescript
// ❌ Trước
const trendData = trendsData?.map(item => {
  return {
    date: dayName,
    created: item.created,      // ❌ undefined
    resolved: item.resolved,    // ❌ undefined
    closed: 0,                  // ❌ hardcoded
  };
}) || [];

// ✅ Sau
const trendData = trendsData?.map(item => {
  const date = new Date(item.period);
  const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
  return {
    date: dayName,
    created: item.ticketsCreated || 0,    // ✅ Đúng field name
    resolved: item.ticketsResolved || 0,  // ✅ Đúng field name
    closed: item.ticketsClosed || 0,      // ✅ Đúng field name
  };
}) || [];
```

**Thay đổi**:
- ✅ Map đúng field names từ backend
- ✅ Thêm fallback `|| 0` để tránh undefined
- ✅ Đổi locale sang `'vi-VN'` cho ngày tiếng Việt

### 2. Fix SLA Gauge - Thêm dữ liệu thực

#### Backend DTO (`apps/backend/src/modules/reports/dto/dashboard-stats.dto.ts`)
```typescript
export class DashboardStatsDto {
  // ... existing fields
  declare slaComplianceRate: number;
  declare slaBreached: number;      // ✅ Thêm mới
  declare slaAtRisk: number;        // ✅ Thêm mới
  // ...
}
```

#### Backend Service (`apps/backend/src/modules/reports/reports.service.ts`)
```typescript
async getDashboardStats(dateRange?: DateRange): Promise<DashboardStatsDto> {
  // ... existing code

  // ✅ SLA breached count (resolved tickets that missed SLA)
  const slaBreached = await this.ticketModel.count({
    where: {
      ...where,
      dueDate: { [Op.ne]: null },
      resolvedAt: { [Op.ne]: null },
      [Op.and]: [
        literal('resolved_at > due_date'),
      ],
    },
  });

  // ✅ SLA at risk count (open tickets approaching due date - within 2 hours)
  const twoHoursFromNow = new Date();
  twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);
  const slaAtRisk = await this.ticketModel.count({
    where: {
      dueDate: {
        [Op.ne]: null,
        [Op.lte]: twoHoursFromNow,
        [Op.gte]: new Date(),
      },
      status: {
        [Op.in]: [
          TicketStatus.NEW,
          TicketStatus.ASSIGNED,
          TicketStatus.IN_PROGRESS,
          TicketStatus.PENDING,
        ],
      },
    },
  });

  return {
    // ... existing fields
    slaComplianceRate: Math.round(slaCompliance * 10) / 10,
    slaBreached,    // ✅ Trả về data thực
    slaAtRisk,      // ✅ Trả về data thực
    // ...
  };
}
```

**Logic tính toán**:
- **slaBreached**: Tickets đã resolved nhưng quá `dueDate` (vi phạm SLA)
- **slaAtRisk**: Tickets đang open và sắp đến `dueDate` (trong vòng 2 giờ)

#### Frontend (`apps/frontend/src/app/(dashboard)/dashboard/page.tsx`)
```typescript
// ❌ Trước - Dùng fake data
<SLAGaugeChart 
  value={dashboardData?.slaComplianceRate || 85}  // ❌ Fallback 85
  target={95}
  breachedCount={dashboardData?.slaBreached || 3} // ❌ Fallback 3
  atRiskCount={5}                                 // ❌ Hardcoded 5
/>

// ✅ Sau - Dùng real data
<SLAGaugeChart 
  value={dashboardData?.slaComplianceRate || 0}   // ✅ Fallback 0
  target={95}
  breachedCount={dashboardData?.slaBreached || 0} // ✅ Real data
  atRiskCount={dashboardData?.slaAtRisk || 0}     // ✅ Real data
/>
```

## 📊 Kết quả

### Trend Chart
- ✅ Hiển thị đúng số lượng tickets created/resolved/closed theo ngày
- ✅ Dữ liệu thực từ database
- ✅ Ngày hiển thị bằng tiếng Việt (T2, T3, T4...)

### SLA Gauge
- ✅ `slaComplianceRate`: Tỷ lệ tuân thủ SLA thực tế (%)
- ✅ `slaBreached`: Số tickets đã vi phạm SLA (resolved quá hạn)
- ✅ `slaAtRisk`: Số tickets có nguy cơ vi phạm (sắp đến hạn trong 2h)
- ✅ Không còn dữ liệu fake

## 🔍 Cách kiểm tra

### 1. Trend Chart
```bash
# Tạo một vài tickets trong database
# Resolve một số tickets
# Refresh dashboard → Chart sẽ hiển thị data thực
```

### 2. SLA Gauge
```bash
# Kiểm tra tickets có dueDate trong database
# Nếu có tickets resolved sau dueDate → slaBreached tăng
# Nếu có tickets open với dueDate < 2h → slaAtRisk tăng
# slaComplianceRate = (tickets met SLA / total tickets) * 100
```

## 📝 Notes

### SLA Calculation
- **Compliance Rate**: Tính dựa trên tickets có `dueDate` và `resolvedAt`
- **Breached**: `resolvedAt > dueDate`
- **At Risk**: Open tickets với `dueDate` trong vòng 2 giờ tới

### Trend Data
- **Period**: Có thể là `day`, `week`, hoặc `month`
- **Default**: 7 ngày gần nhất (có thể config qua query param `?period=day&limit=7`)
- **Data**: Đếm tickets theo `createdAt`, `resolvedAt`, `closedAt`

## 🎯 Files đã sửa

1. ✅ `apps/backend/src/modules/reports/dto/dashboard-stats.dto.ts`
2. ✅ `apps/backend/src/modules/reports/reports.service.ts`
3. ✅ `apps/frontend/src/app/(dashboard)/dashboard/page.tsx`

Tất cả charts bây giờ đều hiển thị **dữ liệu thực từ database**, không còn fake data! 🎉
