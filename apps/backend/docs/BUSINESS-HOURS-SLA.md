# Business Hours SLA Implementation

## Overview

SLA calculation now uses business hours instead of 24/7 calendar time. This ensures accurate SLA tracking that respects working hours and holidays.

## Features

### 1. Business Hours Configuration
- Define working hours per day of week (0=Sunday, 6=Saturday)
- Default: Monday-Friday 8:00-17:30
- Weekend: Non-working days

### 2. Holiday Calendar
- Manage public holidays
- Recurring holidays (e.g., New Year)
- One-time holidays (e.g., Tet 2026)

### 3. SLA Calculation
- Due dates calculated using business hours only
- Excludes weekends and holidays
- Accurate time tracking

## Database Schema

### business_hours
```sql
CREATE TABLE business_hours (
  id SERIAL PRIMARY KEY,
  day_of_week INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_working_day BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### holidays
```sql
CREATE TABLE holidays (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## API Endpoints

### GET /business-hours/holidays
Get all holidays or filter by year

**Query Parameters:**
- `year` (optional): Filter by year (e.g., 2026)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tết Dương lịch",
    "date": "2026-01-01",
    "isRecurring": true,
    "description": "Năm mới dương lịch"
  }
]
```

### GET /business-hours/check-working-day
Check if a date is a working day

**Query Parameters:**
- `date` (required): Date to check (YYYY-MM-DD)

**Response:**
```json
{
  "date": "2026-01-01",
  "isWorkingDay": false
}
```

### GET /business-hours/calculate
Calculate business hours between two dates

**Query Parameters:**
- `start` (required): Start date (ISO 8601)
- `end` (required): End date (ISO 8601)

**Response:**
```json
{
  "start": "2026-01-15T09:00:00Z",
  "end": "2026-01-17T15:00:00Z",
  "businessHours": 14.5
}
```

## Usage Examples

### Calculate SLA Due Date
```typescript
// When creating a ticket
const slaRule = await slaService.findByPriority('High');
const dueDate = await businessHoursService.addBusinessHours(
  ticket.createdAt,
  slaRule.resolutionTimeHours
);
```

### Check if Ticket is Overdue
```typescript
const now = new Date();
const businessHoursUsed = await businessHoursService.calculateBusinessHours(
  ticket.createdAt,
  now
);
const isOverdue = businessHoursUsed > slaRule.resolutionTimeHours;
```

## Migration

Run migration to create tables and seed default data:

```bash
npm run db:migrate
```

This will:
1. Create `business_hours` table
2. Create `holidays` table
3. Insert default business hours (Mon-Fri 8:00-17:30)
4. Insert Vietnam public holidays for 2026

## Configuration

Default business hours can be modified in the database:

```sql
-- Update working hours
UPDATE business_hours 
SET start_time = '09:00:00', end_time = '18:00:00'
WHERE day_of_week BETWEEN 1 AND 5;

-- Add Saturday as half-day
UPDATE business_hours 
SET is_working_day = true, start_time = '08:00:00', end_time = '12:00:00'
WHERE day_of_week = 6;
```

## Testing

Test business hours calculation:

```bash
# Check if today is working day
curl "http://localhost:3000/business-hours/check-working-day?date=2026-01-15"

# Calculate business hours
curl "http://localhost:3000/business-hours/calculate?start=2026-01-15T09:00:00Z&end=2026-01-17T15:00:00Z"

# Get holidays for 2026
curl "http://localhost:3000/business-hours/holidays?year=2026"
```

## Notes

- SLA calculation now automatically uses business hours
- Existing tickets will use old calculation until updated
- Holiday calendar should be updated annually
- Business hours can be customized per company needs
