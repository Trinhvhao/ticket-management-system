# Escalation 500 Error Fix

## 🐛 Vấn đề

**Error**: `GET /api/v1/escalation/rules` trả về 500 Internal Server Error

**Nguyên nhân**: 
- `EscalationRule` entity thiếu `underscored: true`
- `EscalationHistory` entity thiếu `underscored: true`
- Sequelize không thể map camelCase properties sang snake_case columns

## ✅ Giải pháp

### 1. Fixed EscalationRule Entity

**File**: `apps/backend/src/database/entities/escalation-rule.entity.ts`

**Before**:
```typescript
@Table({
  tableName: 'escalation_rules',
  timestamps: true,
})
```

**After**:
```typescript
@Table({
  tableName: 'escalation_rules',
  timestamps: true,
  underscored: true,  // ✅ Added
})
```

### 2. Fixed EscalationHistory Entity

**File**: `apps/backend/src/database/entities/escalation-history.entity.ts`

**Before**:
```typescript
@Table({
  tableName: 'escalation_history',
  timestamps: false,
})
```

**After**:
```typescript
@Table({
  tableName: 'escalation_history',
  timestamps: false,
  underscored: true,  // ✅ Added
})
```

## 🧪 Testing

### Test Script
```bash
node test-escalation.js
```

### Expected Result
```
✅ GET /escalation/rules - 200 OK
```

## 📊 Impact

**Entities Fixed**:
- ✅ EscalationRule
- ✅ EscalationHistory

**Endpoints Fixed**:
- ✅ GET /api/v1/escalation/rules
- ✅ POST /api/v1/escalation/rules
- ✅ GET /api/v1/escalation/rules/:id
- ✅ PATCH /api/v1/escalation/rules/:id
- ✅ DELETE /api/v1/escalation/rules/:id
- ✅ GET /api/v1/escalation/history

## 🔧 Build & Deploy

```bash
cd apps/backend
npm run build
# Restart backend server
```

## ✅ Verification

All entities now have `underscored: true`:
- ✅ User
- ✅ Ticket
- ✅ Comment
- ✅ Category
- ✅ KnowledgeArticle
- ✅ SlaRule
- ✅ BusinessHours
- ✅ Holiday
- ✅ EscalationRule (FIXED)
- ✅ EscalationHistory (FIXED)
- ✅ RefreshToken

## 🎯 Conclusion

Fixed 500 error by adding `underscored: true` to escalation entities. This ensures Sequelize correctly maps camelCase properties to snake_case database columns.

**Status**: ✅ FIXED
**Date**: January 20, 2026
