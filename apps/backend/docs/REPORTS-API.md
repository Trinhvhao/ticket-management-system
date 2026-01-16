# Reports & Analytics API Documentation

## Overview

Module cung cấp dashboard statistics và reports cho management, tuân thủ ITIL CSI (Continual Service Improvement).

## Base URL

```
/api/reports
```

## Authentication

Tất cả endpoints yêu cầu JWT authentication token.

## Endpoints

### 1. Dashboard Statistics

Get tổng quan dashboard với các metrics quan trọng.

**Endpoint:** `GET /reports/dashboard`

**Access:** All authenticated users

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | ISO Date | No | Filter from date |
| endDate | ISO Date | No | Filter to date |

**Response:** `200 OK`

```json
{
  "totalTickets": 1250,
  "openTickets": 45,
  "closedToday": 12,
  "closedThisWeek": 67,
  "closedThisMonth": 234,
  "averageResolutionHours": 18.5,
  "slaComplianceRate": 92.3,
  "ticketsByPriority": {
    "High": 8,
    "Medium": 25,
    "Low": 12
  },
  "ticketsByStatus": {
    "New": 15,
    "Assigned": 12,
    "In Progress": 10,
    "Pending": 8,
    "Resolved": 20,
    "Closed": 180
  }
}
```

**Example:**

```bash
curl -X GET "http://localhost:3000/api/reports/dashboard?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer <token>"
```

---

### 2. Tickets by Status

Get breakdown tickets theo status.

**Endpoint:** `GET /reports/tickets-by-status`

**Access:** IT_Staff, Admin

**Query Parameters:** Same as dashboard

**Response:** `200 OK`

```json
[
  {
    "status": "New",
    "count": 45,
    "percentage": 15.2
  },
  {
    "status": "In Progress",
    "count": 78,
    "percentage": 26.4
  }
]
```

---

### 3. Tickets by Category

Get breakdown tickets theo category.

**Endpoint:** `GET /reports/tickets-by-category`

**Access:** IT_Staff, Admin

**Query Parameters:** Same as dashboard

**Response:** `200 OK`

```json
[
  {
    "categoryId": 1,
    "categoryName": "Hardware",
    "count": 120,
    "percentage": 35.5
  },
  {
    "categoryId": 2,
    "categoryName": "Software",
    "count": 95,
    "percentage": 28.1
  }
]
```

---

### 4. Tickets by Priority

Get breakdown tickets theo priority với average resolution time.

**Endpoint:** `GET /reports/tickets-by-priority`

**Access:** IT_Staff, Admin

**Query Parameters:** Same as dashboard

**Response:** `200 OK`

```json
[
  {
    "priority": "High",
    "count": 85,
    "percentage": 25.2,
    "averageResolutionHours": 8.5
  },
  {
    "priority": "Medium",
    "count": 180,
    "percentage": 53.4,
    "averageResolutionHours": 18.2
  },
  {
    "priority": "Low",
    "count": 72,
    "percentage": 21.4,
    "averageResolutionHours": 36.7
  }
]
```

---

### 5. SLA Compliance Report

Get SLA compliance metrics.

**Endpoint:** `GET /reports/sla-compliance`

**Access:** IT_Staff, Admin

**Query Parameters:** Same as dashboard

**Response:** `200 OK`

```json
{
  "totalTickets": 1000,
  "metSla": 923,
  "breachedSla": 77,
  "complianceRate": 92.3,
  "averageResolutionHours": 18.5,
  "byPriority": [
    {
      "priority": "High",
      "total": 200,
      "met": 185,
      "breached": 15,
      "rate": 92.5
    },
    {
      "priority": "Medium",
      "total": 500,
      "met": 465,
      "breached": 35,
      "rate": 93.0
    },
    {
      "priority": "Low",
      "total": 300,
      "met": 273,
      "breached": 27,
      "rate": 91.0
    }
  ]
}
```

---

### 6. Staff Performance

Get IT Staff performance metrics.

**Endpoint:** `GET /reports/staff-performance`

**Access:** Admin only

**Query Parameters:** Same as dashboard

**Response:** `200 OK`

```json
[
  {
    "staffId": 10,
    "staffName": "John Doe",
    "staffEmail": "john@28h.com",
    "assignedTickets": 45,
    "resolvedTickets": 38,
    "averageResolutionHours": 16.2,
    "slaComplianceRate": 94.7,
    "currentWorkload": 7
  },
  {
    "staffId": 11,
    "staffName": "Jane Smith",
    "staffEmail": "jane@28h.com",
    "assignedTickets": 52,
    "resolvedTickets": 45,
    "averageResolutionHours": 14.8,
    "slaComplianceRate": 96.2,
    "currentWorkload": 7
  }
]
```

---

### 7. Ticket Trends

Get time-series data cho trends analysis.

**Endpoint:** `GET /reports/trends`

**Access:** IT_Staff, Admin

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| period | String | No | week | 'day', 'week', or 'month' |
| limit | Number | No | 12 | Number of periods |

**Response:** `200 OK`

```json
[
  {
    "period": "2024-01-01",
    "ticketsCreated": 45,
    "ticketsResolved": 38,
    "ticketsClosed": 35,
    "averageResolutionHours": 18.5
  },
  {
    "period": "2024-01-08",
    "ticketsCreated": 52,
    "ticketsResolved": 45,
    "ticketsClosed": 42,
    "averageResolutionHours": 16.2
  }
]
```

**Example:**

```bash
# Get last 30 days
curl -X GET "http://localhost:3000/api/reports/trends?period=day&limit=30" \
  -H "Authorization: Bearer <token>"

# Get last 12 weeks
curl -X GET "http://localhost:3000/api/reports/trends?period=week&limit=12" \
  -H "Authorization: Bearer <token>"

# Get last 12 months
curl -X GET "http://localhost:3000/api/reports/trends?period=month&limit=12" \
  -H "Authorization: Bearer <token>"
```

---

## Access Control Summary

| Endpoint | Employee | IT_Staff | Admin |
|----------|----------|----------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| Tickets by Status | ❌ | ✅ | ✅ |
| Tickets by Category | ❌ | ✅ | ✅ |
| Tickets by Priority | ❌ | ✅ | ✅ |
| SLA Compliance | ❌ | ✅ | ✅ |
| Staff Performance | ❌ | ❌ | ✅ |
| Trends | ❌ | ✅ | ✅ |

---

## Use Cases

### 1. Management Dashboard
```javascript
// Get overview stats
const stats = await fetch('/api/reports/dashboard');

// Display on dashboard
<DashboardCard>
  <h3>Total Tickets</h3>
  <p>{stats.totalTickets}</p>
</DashboardCard>
```

### 2. Performance Analysis
```javascript
// Get staff performance
const performance = await fetch('/api/reports/staff-performance');

// Identify top performers
const topPerformer = performance[0];
console.log(`Top: ${topPerformer.staffName} - ${topPerformer.slaComplianceRate}%`);
```

### 3. Trend Visualization
```javascript
// Get 12-week trends
const trends = await fetch('/api/reports/trends?period=week&limit=12');

// Plot on chart
<LineChart data={trends} />
```

### 4. SLA Monitoring
```javascript
// Get SLA compliance
const sla = await fetch('/api/reports/sla-compliance');

// Alert if below threshold
if (sla.complianceRate < 90) {
  alert('SLA compliance below 90%!');
}
```

---

## Frontend Integration Example

```javascript
// React Hook for Dashboard
const useDashboardStats = (dateRange) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (dateRange.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange.endDate) params.append('endDate', dateRange.endDate);

    fetch(`/api/reports/dashboard?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, [dateRange]);

  return { stats, loading };
};

// Usage
const Dashboard = () => {
  const { stats, loading } = useDashboardStats({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  });

  if (loading) return <Spinner />;

  return (
    <div>
      <h1>Dashboard</h1>
      <StatsCard>
        <h3>Total Tickets</h3>
        <p>{stats.totalTickets}</p>
      </StatsCard>
      <StatsCard>
        <h3>Open Tickets</h3>
        <p>{stats.openTickets}</p>
      </StatsCard>
      <StatsCard>
        <h3>SLA Compliance</h3>
        <p>{stats.slaComplianceRate}%</p>
      </StatsCard>
    </div>
  );
};
```

---

## ITIL/ITSM Compliance

Module này đáp ứng các yêu cầu ITIL CSI:

✅ **Performance Metrics** - Track KPIs  
✅ **Trend Analysis** - Identify patterns  
✅ **SLA Monitoring** - Service level tracking  
✅ **Staff Performance** - Resource optimization  
✅ **Data-driven decisions** - Management insights  

---

## Notes

- Tất cả dates sử dụng ISO 8601 format
- Percentages được làm tròn đến 1 chữ số thập phân
- Hours được làm tròn đến 1 chữ số thập phân
- Date ranges là inclusive (bao gồm cả startDate và endDate)
- Nếu không có dateRange, sẽ query tất cả data
