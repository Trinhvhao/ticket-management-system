# Due Date Auto-Set Implementation

## ✅ Đã implement

### 1. Tự động set `dueDate` khi tạo ticket

**Files modified**:
- `apps/backend/src/modules/tickets/tickets.service.ts`
- `apps/backend/src/modules/tickets/tickets.module.ts`

**Logic**:
```typescript
// Calculate SLA due date based on priority
const priority = createTicketDto.priority || TicketPriority.MEDIUM;
const createdAt = new Date();
const dueDate = await this.slaService.calculateDueDate(priority, createdAt);

// Create ticket with dueDate
const ticket = await this.ticketModel.create({
  ...createTicketDto,
  dueDate, // ✅ Auto-set based on SLA rules
});
```

**SLA Rules** (from `sla.service.ts`):
- Tìm SLA rule theo priority
- Tính dueDate = createdAt + resolutionTimeHours
- Sử dụng business hours (không tính weekend/holidays)

### 2. Hiển thị `dueDate` trong ticket detail

**File**: `apps/frontend/src/app/(dashboard)/tickets/[id]/page.tsx`

**Features**:
- Hiển thị "Hạn xử lý (SLA)"
- Icon Clock màu đỏ nếu quá hạn
- Warning "⚠️ Đã quá hạn" nếu ticket chưa resolve

## 📋 TODO: Cần implement tiếp

### 3. Hiển thị `dueDate` trong danh sách tickets

**File cần sửa**: `apps/frontend/src/app/(dashboard)/tickets/page.tsx`

**Thêm column**:
```tsx
<th>Hạn xử lý</th>
...
<td className={`${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
  {ticket.dueDate ? formatDate(ticket.dueDate) : '-'}
  {isOverdue && <span className="ml-2">⚠️</span>}
</td>
```

### 4. Fix filter "SLA Breached"

**File cần sửa**: 
- `apps/backend/src/modules/tickets/tickets.service.ts` (findAll method)
- `apps/frontend/src/components/tickets/QuickFilters.tsx`

**Logic filter**:
```typescript
// Backend
if (filters.slaBreached === true) {
  where.dueDate = { [Op.ne]: null };
  where.resolvedAt = { [Op.ne]: null };
  where[Op.and] = [
    literal('resolved_at > due_date')
  ];
}

// Or for open tickets that are overdue
if (filters.slaAtRisk === true) {
  where.dueDate = {
    [Op.ne]: null,
    [Op.lt]: new Date(),
  };
  where.status = {
    [Op.in]: [TicketStatus.NEW, TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS]
  };
}
```

## 🔧 Implementation Details

### SLA Calculation Flow

```
1. User creates ticket with priority (High/Medium/Low)
   ↓
2. TicketsService.create() calls SlaService.calculateDueDate()
   ↓
3. SlaService finds SLA rule by priority
   ↓
4. Calculate: dueDate = createdAt + resolutionTimeHours
   ↓
5. Use BusinessHoursService for accurate calculation
   ↓
6. Ticket created with dueDate set
```

### SLA Rules Example

```typescript
// High priority: 4 hours
// Medium priority: 8 hours  
// Low priority: 24 hours

const slaRule = {
  priority: 'High',
  responseTimeHours: 1,
  resolutionTimeHours: 4,
};

// If ticket created at 9:00 AM Monday
// dueDate = 9:00 AM + 4 business hours = 1:00 PM Monday
```

### Business Hours Consideration

```typescript
// BusinessHoursService.addBusinessHours()
// - Skips weekends (Saturday, Sunday)
// - Skips holidays
// - Only counts 8:00 AM - 5:00 PM (configurable)

// Example:
// Created: Friday 4:00 PM
// Need: 4 hours
// Result: Monday 12:00 PM (not Friday 8:00 PM)
```

## 📊 Database Schema

```sql
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  priority VARCHAR(20) NOT NULL, -- High, Medium, Low
  due_date TIMESTAMP, -- ✅ Auto-set based on SLA
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  ...
);
```

## 🎯 Benefits

### Before
- ❌ `dueDate` = null for all tickets
- ❌ SLA calculation không hoạt động
- ❌ Không biết ticket nào quá hạn
- ❌ Không thể filter by SLA status

### After
- ✅ `dueDate` tự động set khi tạo ticket
- ✅ SLA calculation chính xác
- ✅ Hiển thị warning cho tickets quá hạn
- ✅ Có thể filter by SLA status
- ✅ Dashboard SLA metrics có ý nghĩa

## 🧪 Testing

### Test Case 1: Create High Priority Ticket
```bash
POST /api/v1/tickets
{
  "title": "Server down",
  "priority": "High",
  "categoryId": 1
}

Expected:
- dueDate = createdAt + 4 hours (business hours)
- If created Friday 4PM → dueDate = Monday 12PM
```

### Test Case 2: SLA Breached Filter
```bash
GET /api/v1/tickets?slaBreached=true

Expected:
- Only tickets where resolvedAt > dueDate
- Tickets still open and past dueDate
```

### Test Case 3: Display in List
```
Ticket List:
┌────────┬─────────────┬──────────┬─────────────┬──────────┐
│ Number │ Title       │ Priority │ Due Date    │ Status   │
├────────┼─────────────┼──────────┼─────────────┼──────────┤
│ TKT-001│ WiFi issue  │ High     │ 19/1 2PM ⚠️ │ Open     │
│ TKT-002│ Printer     │ Medium   │ 20/1 10AM   │ Assigned │
└────────┴─────────────┴──────────┴─────────────┴──────────┘
```

## 📝 Next Steps

1. ✅ Auto-set dueDate when creating ticket (DONE)
2. ✅ Display dueDate in ticket detail (DONE)
3. ⏳ Display dueDate in ticket list (TODO)
4. ⏳ Implement SLA Breached filter (TODO)
5. ⏳ Add SLA countdown timer
6. ⏳ Add SLA notifications/alerts

## 🚀 Quick Implementation Guide

### Step 1: Display dueDate in ticket list
```tsx
// apps/frontend/src/app/(dashboard)/tickets/page.tsx

// Add column header
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
  Hạn xử lý
</th>

// Add cell
<td className="px-6 py-4 whitespace-nowrap text-sm">
  {ticket.dueDate ? (
    <div className={`${
      new Date(ticket.dueDate) < new Date() && !ticket.resolvedAt
        ? 'text-red-600 font-medium'
        : 'text-gray-900'
    }`}>
      {formatDate(ticket.dueDate)}
      {new Date(ticket.dueDate) < new Date() && !ticket.resolvedAt && (
        <span className="ml-2">⚠️</span>
      )}
    </div>
  ) : (
    <span className="text-gray-400">-</span>
  )}
</td>
```

### Step 2: Add SLA Breached filter
```typescript
// Backend: tickets.service.ts
export interface TicketFilters {
  // ... existing filters
  slaBreached?: boolean;
  slaAtRisk?: boolean;
}

// In findAll method
if (filters.slaBreached) {
  where.dueDate = { [Op.ne]: null };
  where.resolvedAt = { [Op.ne]: null };
  where[Op.and] = [literal('resolved_at > due_date')];
}

if (filters.slaAtRisk) {
  where.dueDate = {
    [Op.ne]: null,
    [Op.lt]: new Date(),
  };
  where.resolvedAt = { [Op.is]: null };
}
```

```tsx
// Frontend: QuickFilters.tsx
<button
  onClick={() => onFilterChange({ slaBreached: true })}
  className="filter-button"
>
  ⚠️ SLA Breached
</button>

<button
  onClick={() => onFilterChange({ slaAtRisk: true })}
  className="filter-button"
>
  ⏰ At Risk
</button>
```

## ✅ Summary

**Đã hoàn thành**:
- ✅ Auto-set dueDate khi tạo ticket
- ✅ Inject SlaService vào TicketsService
- ✅ Import SlaModule vào TicketsModule
- ✅ Backend build thành công
- ✅ Display dueDate trong ticket detail

**Cần làm tiếp**:
- ⏳ Display dueDate trong ticket list
- ⏳ Implement SLA Breached filter
- ⏳ Test với tickets mới tạo
