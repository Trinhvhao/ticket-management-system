# SLA 0% - Giải thích và Cách Fix

## 🔍 Tại sao SLA hiển thị 0%?

### Logic tính SLA Compliance
```typescript
private async calculateSlaComplianceRate(where: any): Promise<number> {
  const tickets = await this.ticketModel.findAll({
    where: {
      ...where,
      dueDate: { [Op.ne]: null },      // ⚠️ Phải có dueDate
      resolvedAt: { [Op.ne]: null },   // ⚠️ Phải đã resolved
    },
    attributes: ['dueDate', 'resolvedAt'],
    raw: true,
  });

  if (tickets.length === 0) return 0;  // ❌ Không có ticket → 0%

  const metSla = tickets.filter(
    (ticket: any) =>
      new Date(ticket.resolvedAt) <= new Date(ticket.dueDate),
  ).length;

  return (metSla / tickets.length) * 100;
}
```

### Điều kiện để tính SLA
1. ✅ Ticket phải có `dueDate` (không null)
2. ✅ Ticket phải có `resolvedAt` (đã resolved)
3. ✅ So sánh: `resolvedAt <= dueDate` → Met SLA
4. ✅ So sánh: `resolvedAt > dueDate` → Breached SLA

## ❌ Vấn đề hiện tại

### Tickets không có `dueDate`
```sql
SELECT * FROM tickets WHERE due_date IS NULL;
-- Kết quả: Tất cả hoặc hầu hết tickets
```

**Nguyên nhân**:
- Tickets được tạo nhưng không có SLA rules
- `dueDate` không được tự động set khi tạo ticket
- Không có logic tính toán `dueDate` dựa trên priority

## 🔧 Cách Fix

### Option 1: Tự động set dueDate khi tạo ticket (RECOMMENDED)

**File**: `apps/backend/src/modules/tickets/tickets.service.ts`

```typescript
async create(createTicketDto: CreateTicketDto, submitterId: number) {
  // Calculate dueDate based on priority
  const dueDate = this.calculateDueDate(createTicketDto.priority);
  
  const ticket = await this.ticketModel.create({
    ...createTicketDto,
    submitterId,
    status: TicketStatus.NEW,
    dueDate, // ✅ Set dueDate
  });
  
  return ticket;
}

private calculateDueDate(priority: string): Date {
  const now = new Date();
  const businessHours = 8; // 8 hours per day
  
  // SLA response time (in business hours)
  const slaHours = {
    High: 4,      // 4 hours
    Medium: 8,    // 1 business day
    Low: 24,      // 3 business days
  };
  
  const hours = slaHours[priority] || 24;
  
  // Simple calculation (can be improved with business hours service)
  const dueDate = new Date(now);
  dueDate.setHours(dueDate.getHours() + hours);
  
  return dueDate;
}
```

### Option 2: Update existing tickets với dueDate

**Script**: `apps/backend/src/database/update-ticket-due-dates.ts`

```typescript
import { Ticket } from './entities/ticket.entity';

async function updateTicketDueDates() {
  const tickets = await Ticket.findAll({
    where: { dueDate: null },
  });

  for (const ticket of tickets) {
    const dueDate = calculateDueDate(ticket.priority, ticket.createdAt);
    await ticket.update({ dueDate });
  }

  console.log(`Updated ${tickets.length} tickets with dueDate`);
}

function calculateDueDate(priority: string, createdAt: Date): Date {
  const slaHours = {
    High: 4,
    Medium: 8,
    Low: 24,
  };
  
  const hours = slaHours[priority] || 24;
  const dueDate = new Date(createdAt);
  dueDate.setHours(dueDate.getHours() + hours);
  
  return dueDate;
}

updateTicketDueDates();
```

### Option 3: Sử dụng SLA Rules (BEST PRACTICE)

**File**: `apps/backend/src/modules/sla/sla.service.ts`

```typescript
async calculateDueDate(
  priority: string,
  categoryId: number,
  createdAt: Date = new Date(),
): Promise<Date> {
  // Find SLA rule
  const slaRule = await this.slaRuleModel.findOne({
    where: { priority, categoryId, isActive: true },
  });

  if (!slaRule) {
    // Default SLA if no rule found
    return this.getDefaultDueDate(priority, createdAt);
  }

  // Calculate due date using business hours service
  return this.businessHoursService.addBusinessHours(
    createdAt,
    slaRule.responseTime,
  );
}
```

## 📊 Test SLA Calculation

### Manual Test
```bash
# Run debug script
node test-sla-debug.js
```

### Expected Output
```
📊 SLA CALCULATION SUMMARY
=====================================

Total tickets: 4
Tickets with dueDate: 4
Tickets resolved: 2
Tickets resolved WITH dueDate: 2

✅ Met SLA: 1
❌ Breached SLA: 1
📈 SLA Compliance Rate: 50.0%
```

## 🎯 Implementation Steps

### Step 1: Add dueDate calculation to ticket creation
```typescript
// apps/backend/src/modules/tickets/tickets.service.ts

async create(createTicketDto: CreateTicketDto, submitterId: number) {
  const dueDate = await this.calculateDueDate(
    createTicketDto.priority,
    createTicketDto.categoryId,
  );
  
  const ticket = await this.ticketModel.create({
    ...createTicketDto,
    submitterId,
    status: TicketStatus.NEW,
    dueDate,
  });
  
  return ticket;
}
```

### Step 2: Update existing tickets
```sql
-- Quick fix: Set dueDate for existing tickets
UPDATE tickets 
SET due_date = CASE 
  WHEN priority = 'High' THEN created_at + INTERVAL '4 hours'
  WHEN priority = 'Medium' THEN created_at + INTERVAL '8 hours'
  WHEN priority = 'Low' THEN created_at + INTERVAL '24 hours'
  ELSE created_at + INTERVAL '24 hours'
END
WHERE due_date IS NULL;
```

### Step 3: Verify SLA calculation
```bash
# Check dashboard
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/v1/reports/dashboard

# Should show:
# "slaComplianceRate": 50.0  (not 0)
```

## 📈 Expected Results After Fix

### Before Fix
```json
{
  "slaComplianceRate": 0,
  "slaBreached": 0,
  "slaAtRisk": 0
}
```

### After Fix
```json
{
  "slaComplianceRate": 75.5,
  "slaBreached": 2,
  "slaAtRisk": 3
}
```

## 🔍 Debugging Checklist

- [ ] Check if tickets have `dueDate` set
- [ ] Check if tickets have `resolvedAt` set
- [ ] Verify SLA rules are configured
- [ ] Test `calculateDueDate` function
- [ ] Check business hours service
- [ ] Verify database timezone settings
- [ ] Test with different priorities

## 💡 Best Practices

### 1. Always set dueDate when creating ticket
```typescript
const ticket = await Ticket.create({
  ...data,
  dueDate: calculateDueDate(priority, createdAt),
});
```

### 2. Use SLA rules for flexibility
```typescript
const slaRule = await SLARule.findOne({ priority, categoryId });
const dueDate = addBusinessHours(createdAt, slaRule.responseTime);
```

### 3. Consider business hours
```typescript
// Don't count weekends and holidays
const dueDate = businessHoursService.addBusinessHours(
  createdAt,
  slaHours,
  { excludeWeekends: true, excludeHolidays: true }
);
```

### 4. Update dueDate on priority change
```typescript
async updatePriority(ticketId: number, newPriority: string) {
  const ticket = await Ticket.findByPk(ticketId);
  const newDueDate = calculateDueDate(newPriority, ticket.createdAt);
  
  await ticket.update({
    priority: newPriority,
    dueDate: newDueDate,
  });
}
```

## 🚀 Quick Fix Command

```bash
# Update all tickets with dueDate
npm run db:update-due-dates

# Or run SQL directly
psql -d ticket_system -c "
UPDATE tickets 
SET due_date = created_at + 
  CASE priority
    WHEN 'High' THEN INTERVAL '4 hours'
    WHEN 'Medium' THEN INTERVAL '8 hours'
    ELSE INTERVAL '24 hours'
  END
WHERE due_date IS NULL;
"
```

## 📝 Summary

**Vấn đề**: SLA 0% vì tickets không có `dueDate`

**Nguyên nhân**: Logic tạo ticket không tự động set `dueDate`

**Giải pháp**:
1. ✅ Thêm logic tính `dueDate` khi tạo ticket
2. ✅ Update existing tickets với `dueDate`
3. ✅ Sử dụng SLA rules cho flexibility
4. ✅ Consider business hours

**Kết quả**: SLA compliance rate sẽ hiển thị chính xác (ví dụ: 75.5%)
