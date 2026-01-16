# SLA Management API Documentation

## Overview

SLA (Service Level Agreement) Management module provides endpoints for managing SLA rules, checking ticket SLA status, and monitoring SLA compliance.

**Base URL:** `/sla`

**Authentication:** Required (JWT token)

---

## Endpoints

### 1. Create SLA Rule

Create a new SLA rule for a specific priority level.

**Endpoint:** `POST /sla/rules`

**Access:** Admin only

**Request Body:**
```json
{
  "priority": "high",
  "responseTimeHours": 1,
  "resolutionTimeHours": 4,
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "priority": "high",
  "responseTimeHours": 1,
  "resolutionTimeHours": 4,
  "responseTimeFormatted": "1 hour",
  "resolutionTimeFormatted": "4 hours",
  "isActive": true,
  "createdAt": "2024-12-31T10:00:00.000Z",
  "updatedAt": "2024-12-31T10:00:00.000Z"
}
```

**Validation:**
- `priority`: Required, must be one of: "low", "medium", "high"
- `responseTimeHours`: Required, integer, minimum 1
- `resolutionTimeHours`: Required, integer, minimum 1
- `isActive`: Optional, boolean, defaults to true

**Error Responses:**
- `409 Conflict` - SLA rule for this priority already exists
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin

---

### 2. Get All SLA Rules

Retrieve all SLA rules.

**Endpoint:** `GET /sla/rules`

**Access:** All authenticated users

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "priority": "high",
    "responseTimeHours": 1,
    "resolutionTimeHours": 4,
    "responseTimeFormatted": "1 hour",
    "resolutionTimeFormatted": "4 hours",
    "isActive": true,
    "createdAt": "2024-12-31T10:00:00.000Z",
    "updatedAt": "2024-12-31T10:00:00.000Z"
  },
  {
    "id": 2,
    "priority": "medium",
    "responseTimeHours": 4,
    "resolutionTimeHours": 24,
    "responseTimeFormatted": "4 hours",
    "resolutionTimeFormatted": "1 day",
    "isActive": true,
    "createdAt": "2024-12-31T10:00:00.000Z",
    "updatedAt": "2024-12-31T10:00:00.000Z"
  },
  {
    "id": 3,
    "priority": "low",
    "responseTimeHours": 8,
    "resolutionTimeHours": 72,
    "responseTimeFormatted": "8 hours",
    "resolutionTimeFormatted": "3 days",
    "isActive": true,
    "createdAt": "2024-12-31T10:00:00.000Z",
    "updatedAt": "2024-12-31T10:00:00.000Z"
  }
]
```

---

### 3. Get SLA Rule by ID

Retrieve a specific SLA rule.

**Endpoint:** `GET /sla/rules/:id`

**Access:** All authenticated users

**Response:** `200 OK`
```json
{
  "id": 1,
  "priority": "high",
  "responseTimeHours": 1,
  "resolutionTimeHours": 4,
  "responseTimeFormatted": "1 hour",
  "resolutionTimeFormatted": "4 hours",
  "isActive": true,
  "createdAt": "2024-12-31T10:00:00.000Z",
  "updatedAt": "2024-12-31T10:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - SLA rule not found

---

### 4. Update SLA Rule

Update an existing SLA rule.

**Endpoint:** `PUT /sla/rules/:id`

**Access:** Admin only

**Request Body:**
```json
{
  "responseTimeHours": 2,
  "resolutionTimeHours": 8,
  "isActive": true
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "priority": "high",
  "responseTimeHours": 2,
  "resolutionTimeHours": 8,
  "responseTimeFormatted": "2 hours",
  "resolutionTimeFormatted": "8 hours",
  "isActive": true,
  "createdAt": "2024-12-31T10:00:00.000Z",
  "updatedAt": "2024-12-31T12:00:00.000Z"
}
```

**Validation:**
- All fields are optional
- `responseTimeHours`: Integer, minimum 1
- `resolutionTimeHours`: Integer, minimum 1
- `isActive`: Boolean

**Error Responses:**
- `404 Not Found` - SLA rule not found
- `400 Bad Request` - Validation error
- `403 Forbidden` - Not admin

---

### 5. Delete SLA Rule

Delete an SLA rule.

**Endpoint:** `DELETE /sla/rules/:id`

**Access:** Admin only

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found` - SLA rule not found
- `403 Forbidden` - Not admin

---

### 6. Check Ticket SLA Status

Check the SLA status of a specific ticket.

**Endpoint:** `GET /sla/tickets/:id/status`

**Access:** All authenticated users

**Response:** `200 OK`

**For Open Tickets:**
```json
{
  "ticketId": 123,
  "status": "at_risk",
  "dueDate": "2024-12-31T14:00:00.000Z",
  "timeRemaining": "2h 30m",
  "percentageUsed": 85,
  "isBreached": false,
  "isAtRisk": true
}
```

**For Breached Tickets:**
```json
{
  "ticketId": 124,
  "status": "breached",
  "dueDate": "2024-12-31T10:00:00.000Z",
  "timeRemaining": "-3h 15m (overdue)",
  "percentageUsed": 100,
  "isBreached": true,
  "isAtRisk": false
}
```

**For Completed Tickets:**
```json
{
  "ticketId": 125,
  "status": "met",
  "dueDate": "2024-12-31T14:00:00.000Z",
  "timeRemaining": null,
  "percentageUsed": 75,
  "isBreached": false,
  "isAtRisk": false
}
```

**For Tickets Without SLA:**
```json
{
  "ticketId": 126,
  "status": "not_applicable",
  "dueDate": null,
  "timeRemaining": null,
  "percentageUsed": null,
  "isBreached": false,
  "isAtRisk": false
}
```

**SLA Status Values:**
- `met` - Ticket resolved within SLA
- `at_risk` - 80%+ of SLA time used, not yet breached
- `breached` - SLA deadline exceeded
- `not_applicable` - No SLA rule for this ticket

**Error Responses:**
- `404 Not Found` - Ticket not found

---

### 7. Get Tickets At Risk

Get all tickets at risk of SLA breach (80%+ of SLA time used).

**Endpoint:** `GET /sla/at-risk`

**Access:** IT Staff and Admin only

**Response:** `200 OK`
```json
{
  "count": 5,
  "tickets": [
    {
      "id": 123,
      "ticketNumber": "TKT-2024-0123",
      "title": "Cannot access email",
      "priority": "high",
      "status": "in_progress",
      "dueDate": "2024-12-31T14:00:00.000Z",
      "createdAt": "2024-12-31T10:00:00.000Z"
    },
    {
      "id": 124,
      "ticketNumber": "TKT-2024-0124",
      "title": "Printer not working",
      "priority": "medium",
      "status": "assigned",
      "dueDate": "2025-01-01T10:00:00.000Z",
      "createdAt": "2024-12-31T08:00:00.000Z"
    }
  ]
}
```

**Logic:**
- Only includes open tickets (new, assigned, in_progress)
- Filters tickets where 80%+ of SLA time has been used
- Excludes already breached tickets

---

### 8. Get Breached Tickets

Get all tickets with breached SLA.

**Endpoint:** `GET /sla/breached`

**Access:** IT Staff and Admin only

**Response:** `200 OK`
```json
{
  "count": 3,
  "tickets": [
    {
      "id": 125,
      "ticketNumber": "TKT-2024-0125",
      "title": "System crash",
      "priority": "high",
      "status": "in_progress",
      "dueDate": "2024-12-31T10:00:00.000Z",
      "createdAt": "2024-12-31T06:00:00.000Z",
      "breachedBy": 3
    },
    {
      "id": 126,
      "ticketNumber": "TKT-2024-0126",
      "title": "Software installation",
      "priority": "medium",
      "status": "assigned",
      "dueDate": "2024-12-30T14:00:00.000Z",
      "createdAt": "2024-12-29T14:00:00.000Z",
      "breachedBy": 23
    }
  ]
}
```

**Fields:**
- `breachedBy`: Hours overdue

**Logic:**
- Only includes open tickets (new, assigned, in_progress)
- Filters tickets where current time > due date

---

## Default SLA Rules

Recommended default SLA rules:

| Priority | Response Time | Resolution Time |
|----------|--------------|-----------------|
| High     | 1 hour       | 4 hours         |
| Medium   | 4 hours      | 24 hours (1 day)|
| Low      | 8 hours      | 72 hours (3 days)|

---

## SLA Calculation Logic

### Due Date Calculation
```
dueDate = createdAt + resolutionTimeHours
```

### Warning Threshold
```
warningThreshold = createdAt + (resolutionTimeHours * 0.8)
```

### Percentage Used
```
percentageUsed = (elapsedTime / totalSlaTime) * 100
```

### Status Determination

**For Open Tickets:**
- `breached`: currentTime > dueDate
- `at_risk`: percentageUsed >= 80% AND not breached
- `met`: percentageUsed < 80%

**For Closed/Resolved Tickets:**
- `breached`: resolvedAt > dueDate
- `met`: resolvedAt <= dueDate

---

## Integration with Tickets Module

### Auto-Calculate Due Date

When creating a ticket, the due date is automatically calculated:

```typescript
// In TicketsService.create()
const slaRule = await this.slaService.findByPriority(priority);
if (slaRule) {
  ticket.dueDate = slaRule.calculateDueDate(ticket.createdAt);
}
```

### Check SLA Before Assignment

```typescript
// Check if ticket is at risk
const slaStatus = await this.slaService.checkTicketSlaStatus(ticketId);
if (slaStatus.isAtRisk) {
  // Send warning notification
}
```

---

## Frontend Integration Examples

### Display SLA Status Badge

```typescript
const getSlaStatusBadge = (status: string) => {
  switch (status) {
    case 'met':
      return <Badge color="success">On Track</Badge>;
    case 'at_risk':
      return <Badge color="warning">At Risk</Badge>;
    case 'breached':
      return <Badge color="error">Breached</Badge>;
    default:
      return <Badge color="default">N/A</Badge>;
  }
};
```

### Fetch SLA Rules

```typescript
const fetchSlaRules = async () => {
  const response = await axios.get('/sla/rules', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

### Check Ticket SLA

```typescript
const checkTicketSla = async (ticketId: number) => {
  const response = await axios.get(`/sla/tickets/${ticketId}/status`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

### Get At-Risk Tickets Dashboard

```typescript
const fetchAtRiskTickets = async () => {
  const response = await axios.get('/sla/at-risk', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

---

## Background Jobs (Recommended)

### SLA Breach Checker

Run every 15 minutes to check for SLA breaches:

```typescript
@Cron('*/15 * * * *')
async checkSlaBreaches() {
  const breachedTickets = await this.slaService.getBreachedTickets();
  
  for (const ticket of breachedTickets) {
    // Send notification to IT staff and admin
    await this.notificationsService.create({
      userId: ticket.assigneeId,
      type: 'sla_breach',
      title: 'SLA Breached',
      message: `Ticket ${ticket.ticketNumber} has breached SLA`,
      ticketId: ticket.id,
    });
  }
}
```

### SLA Warning Checker

Run every 30 minutes to check for at-risk tickets:

```typescript
@Cron('*/30 * * * *')
async checkSlaWarnings() {
  const atRiskTickets = await this.slaService.getTicketsAtRisk();
  
  for (const ticket of atRiskTickets) {
    // Send warning notification
    await this.notificationsService.create({
      userId: ticket.assigneeId,
      type: 'sla_warning',
      title: 'SLA Warning',
      message: `Ticket ${ticket.ticketNumber} is at risk of SLA breach`,
      ticketId: ticket.id,
    });
  }
}
```

---

## ITIL/ITSM Compliance

### Service Level Management

✅ **SLA Definition**
- Define response and resolution times by priority
- Active/inactive status for rules

✅ **SLA Monitoring**
- Real-time SLA status checking
- Warning threshold (80%)
- Breach detection

✅ **SLA Reporting**
- At-risk tickets list
- Breached tickets list
- Compliance metrics (via Reports module)

✅ **Continuous Improvement**
- Track SLA compliance rates
- Identify bottlenecks
- Adjust SLA rules based on data

---

## Testing

### Test SLA Rule Creation

```bash
curl -X POST http://localhost:3000/sla/rules \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "high",
    "responseTimeHours": 1,
    "resolutionTimeHours": 4
  }'
```

### Test SLA Status Check

```bash
curl -X GET http://localhost:3000/sla/tickets/123/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test At-Risk Tickets

```bash
curl -X GET http://localhost:3000/sla/at-risk \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Handling

All endpoints return standard error responses:

```json
{
  "statusCode": 404,
  "message": "SLA rule with ID 999 not found",
  "error": "Not Found"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate SLA rule)
- `500` - Internal Server Error

---

*Last Updated: December 31, 2024*
