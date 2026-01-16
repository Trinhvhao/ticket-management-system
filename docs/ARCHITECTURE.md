# Frontend Architecture - Next.js 15

## 📁 Cấu trúc thư mục (Improved)

```
apps/frontend/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                   # Auth route group (no layout)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/              # Dashboard route group (with layout)
│   │   │   ├── layout.tsx           # Dashboard layout
│   │   │   ├── page.tsx             # Dashboard home
│   │   │   ├── tickets/
│   │   │   │   ├── page.tsx         # Ticket list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx     # Ticket detail
│   │   │   │   └── new/
│   │   │   │       └── page.tsx     # Create ticket
│   │   │   ├── users/
│   │   │   ├── categories/
│   │   │   ├── knowledge/
│   │   │   └── settings/
│   │   ├── api/                      # API routes (optional)
│   │   │   └── health/
│   │   │       └── route.ts
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── globals.css
│   │   └── not-found.tsx
│   │
│   ├── components/                   # React components
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dropdown.tsx
│   │   │   └── index.ts            # Barrel export
│   │   ├── forms/                   # Form components
│   │   │   ├── login-form.tsx
│   │   │   ├── ticket-form.tsx
│   │   │   ├── user-form.tsx
│   │   │   └── index.ts
│   │   ├── layouts/                 # Layout components
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── index.ts
│   │   └── features/                # Feature-specific components
│   │       ├── tickets/
│   │       │   ├── ticket-list.tsx
│   │       │   ├── ticket-card.tsx
│   │       │   ├── ticket-detail.tsx
│   │       │   ├── ticket-filters.tsx
│   │       │   └── index.ts
│   │       ├── users/
│   │       ├── dashboard/
│   │       └── notifications/
│   │
│   ├── lib/                         # Core utilities & configs
│   │   ├── api/                    # API layer
│   │   │   ├── client.ts           # Axios instance
│   │   │   ├── endpoints.ts        # API endpoints
│   │   │   ├── services/           # API service functions
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── ticket.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-tickets.ts
│   │   │   ├── use-users.ts
│   │   │   ├── use-toast.ts
│   │   │   ├── use-modal.ts
│   │   │   └── index.ts
│   │   ├── store/                  # State management (Zustand)
│   │   │   ├── auth.store.ts
│   │   │   ├── ticket.store.ts
│   │   │   ├── ui.store.ts
│   │   │   └── index.ts
│   │   ├── utils/                  # Utility functions
│   │   │   ├── cn.ts              # Tailwind merge
│   │   │   ├── format.ts          # Date, number formatting
│   │   │   ├── validation.ts      # Validation helpers
│   │   │   ├── constants.ts       # App constants
│   │   │   └── index.ts
│   │   ├── providers/              # Context providers
│   │   │   ├── query-provider.tsx  # React Query
│   │   │   ├── toast-provider.tsx  # Toast notifications
│   │   │   └── index.ts
│   │   └── config/                 # App configuration
│   │       ├── site.ts            # Site metadata
│   │       └── env.ts             # Environment variables
│   │
│   ├── types/                       # TypeScript types
│   │   ├── index.ts               # Main types
│   │   ├── api.types.ts           # API types
│   │   ├── form.types.ts          # Form types
│   │   └── store.types.ts         # Store types
│   │
│   └── middleware.ts                # Next.js middleware (auth)
│
├── public/                          # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local                       # Environment variables
├── .env.example
├── next.config.ts                   # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
└── package.json
```

## 🎯 Design Principles

### 1. Feature-First Organization
- Nhóm code theo feature thay vì type
- Dễ tìm và maintain
- Scale tốt khi thêm features mới

### 2. Separation of Concerns
- **Components**: Chỉ UI logic
- **Services**: API calls
- **Hooks**: Reusable logic
- **Store**: Global state
- **Utils**: Pure functions

### 3. Colocation
- Đặt code gần nơi sử dụng
- Feature components trong `components/features/`
- Shared components trong `components/ui/`

### 4. Barrel Exports
- Mỗi folder có `index.ts`
- Import dễ dàng: `import { Button, Input } from '@/components/ui'`

### 5. Type Safety
- Tất cả types trong `types/`
- Shared types trong `types/index.ts`
- Feature-specific types trong feature folders

## 📦 Module Organization

### API Layer
```typescript
// lib/api/services/ticket.service.ts
export const ticketService = {
  getAll: (params) => apiClient.get(ENDPOINTS.TICKETS.LIST, { params }),
  getById: (id) => apiClient.get(ENDPOINTS.TICKETS.GET(id)),
  create: (data) => apiClient.post(ENDPOINTS.TICKETS.CREATE, data),
  update: (id, data) => apiClient.put(ENDPOINTS.TICKETS.UPDATE(id), data),
  delete: (id) => apiClient.delete(ENDPOINTS.TICKETS.DELETE(id)),
};
```

### Custom Hooks
```typescript
// lib/hooks/use-tickets.ts
export function useTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketService.getAll(filters),
  });
}
```

### Store (Zustand)
```typescript
// lib/store/auth.store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
```

### Components
```typescript
// components/features/tickets/ticket-list.tsx
export function TicketList() {
  const { data, isLoading } = useTickets();
  // Component logic
}
```

## 🚀 Benefits

### 1. Scalability
- ✅ Dễ thêm features mới
- ✅ Không bị conflict khi nhiều người code
- ✅ Clear boundaries giữa các modules

### 2. Maintainability
- ✅ Dễ tìm code
- ✅ Dễ refactor
- ✅ Dễ test

### 3. Developer Experience
- ✅ Auto-import với barrel exports
- ✅ Type safety với TypeScript
- ✅ Clear naming conventions

### 4. Performance
- ✅ Code splitting tự động (Next.js)
- ✅ Tree shaking hiệu quả
- ✅ Lazy loading components

## 📝 Naming Conventions

### Files
- Components: `kebab-case.tsx` (ticket-list.tsx)
- Hooks: `use-*.ts` (use-tickets.ts)
- Services: `*.service.ts` (ticket.service.ts)
- Stores: `*.store.ts` (auth.store.ts)
- Types: `*.types.ts` (api.types.ts)
- Utils: `*.ts` (format.ts)

### Components
- PascalCase: `TicketList`, `UserCard`
- Descriptive names: `TicketListItem` not `Item`

### Functions
- camelCase: `getTickets`, `formatDate`
- Verb-first: `handleSubmit`, `fetchUsers`

### Constants
- UPPER_SNAKE_CASE: `API_BASE_URL`, `MAX_FILE_SIZE`

## 🔧 Import Aliases

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

Usage:
```typescript
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { ticketService } from '@/lib/api/services';
import type { Ticket } from '@/types';
```

## 🎨 Component Patterns

### 1. Server Components (Default)
```typescript
// app/(dashboard)/tickets/page.tsx
export default async function TicketsPage() {
  const tickets = await ticketService.getAll();
  return <TicketList tickets={tickets} />;
}
```

### 2. Client Components
```typescript
'use client';

export function TicketForm() {
  const [isLoading, setIsLoading] = useState(false);
  // Client-side logic
}
```

### 3. Compound Components
```typescript
<Card>
  <Card.Header>
    <Card.Title>Ticket Details</Card.Title>
  </Card.Header>
  <Card.Content>
    {/* Content */}
  </Card.Content>
</Card>
```

## 🔐 Authentication Flow

```
1. User login → authService.login()
2. Store token → useAuthStore.login()
3. Middleware checks token → middleware.ts
4. Protected routes → (dashboard) group
5. API calls include token → apiClient interceptor
```

## 📊 State Management Strategy

### Local State
- `useState` cho component state
- `useReducer` cho complex state

### Server State
- React Query cho API data
- Automatic caching & refetching

### Global State
- Zustand cho auth, UI state
- Minimal global state

### URL State
- Search params cho filters
- Route params cho IDs

## 🧪 Testing Strategy

```
components/
  ui/
    button.tsx
    button.test.tsx
  features/
    tickets/
      ticket-list.tsx
      ticket-list.test.tsx
```

## 📚 Documentation

Mỗi module phức tạp nên có:
- JSDoc comments
- README.md trong folder
- Usage examples
- Type definitions
