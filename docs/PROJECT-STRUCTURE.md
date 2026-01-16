# Next.js Project Structure - Official Best Practices

Dựa trên: https://nextjs.org/docs/app/getting-started/project-structure

## 📁 Cấu trúc theo Next.js Official Docs

### Top-level folders
```
apps/frontend/
├── app/                    # App Router (required)
├── pages/                  # Pages Router (không dùng - dùng App Router)
├── public/                 # Static assets
├── src/                    # Optional application source folder
```

### Top-level files
```
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies
├── instrumentation.ts      # OpenTelemetry and Instrumentation
├── middleware.ts           # Next.js request middleware
├── .env                    # Environment variables
├── .env.local              # Local environment variables
├── .env.production         # Production environment variables
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore
├── next-env.d.ts           # TypeScript declaration for Next.js
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🎯 Recommended Structure (với src/)

```
apps/frontend/
├── src/
│   ├── app/                           # App Router
│   │   ├── (auth)/                   # Route Groups
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── tickets/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── loading.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── users/
│   │   │   ├── categories/
│   │   │   └── settings/
│   │   ├── api/                      # API Routes
│   │   │   └── health/
│   │   │       └── route.ts
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── loading.tsx              # Loading UI
│   │   ├── error.tsx                # Error UI
│   │   ├── not-found.tsx            # 404 page
│   │   └── globals.css              # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── ui/                      # Reusable UI components
│   │   ├── forms/                   # Form components
│   │   ├── layouts/                 # Layout components
│   │   └── features/                # Feature components
│   │
│   ├── lib/                         # Utility functions
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── utils/
│   │
│   ├── types/                       # TypeScript types
│   │
│   └── middleware.ts                # Middleware (must be in src/)
│
├── public/                          # Static files
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 📂 App Router Conventions

### Routing Files
| File | Extension | Purpose |
|------|-----------|---------|
| `layout` | `.js` `.jsx` `.tsx` | Layout |
| `page` | `.js` `.jsx` `.tsx` | Page |
| `loading` | `.js` `.jsx` `.tsx` | Loading UI |
| `not-found` | `.js` `.jsx` `.tsx` | Not found UI |
| `error` | `.js` `.jsx` `.tsx` | Error UI |
| `global-error` | `.js` `.jsx` `.tsx` | Global error UI |
| `route` | `.js` `.ts` | API endpoint |
| `template` | `.js` `.jsx` `.tsx` | Re-rendered layout |
| `default` | `.js` `.jsx` `.tsx` | Parallel route fallback |

### Nested Routes
```
app/
├── page.tsx                    # /
├── dashboard/
│   ├── page.tsx               # /dashboard
│   └── settings/
│       └── page.tsx           # /dashboard/settings
```

### Dynamic Routes
```
app/
├── tickets/
│   ├── [id]/
│   │   └── page.tsx           # /tickets/:id
│   └── [...slug]/
│       └── page.tsx           # /tickets/* (catch-all)
```

### Route Groups (Organization)
```
app/
├── (auth)/                     # Không ảnh hưởng URL
│   ├── login/
│   │   └── page.tsx           # /login
│   └── register/
│       └── page.tsx           # /register
├── (dashboard)/
│   ├── layout.tsx             # Shared layout
│   ├── tickets/
│   │   └── page.tsx           # /tickets
│   └── users/
│       └── page.tsx           # /users
```

### Private Folders (Prefix với _)
```
app/
├── _lib/                       # Private folder (không routing)
│   └── utils.ts
├── _components/
│   └── header.tsx
└── page.tsx
```

## 🎨 Component Organization

### Colocation (Đặt cùng chỗ)
```
app/
├── dashboard/
│   ├── page.tsx
│   ├── _components/           # Private components
│   │   ├── stats-card.tsx
│   │   └── chart.tsx
│   └── _lib/                  # Private utilities
│       └── utils.ts
```

### Shared Components
```
src/
├── components/
│   ├── ui/                    # Shared UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── index.ts
│   └── features/              # Feature components
│       ├── tickets/
│       │   ├── ticket-list.tsx
│       │   └── ticket-card.tsx
│       └── users/
```

## 🔧 Lib Organization

### API Layer
```
src/lib/
├── api/
│   ├── client.ts              # Axios instance
│   ├── endpoints.ts           # API endpoints
│   └── services/
│       ├── auth.service.ts
│       ├── ticket.service.ts
│       └── index.ts
```

### Hooks
```
src/lib/hooks/
├── use-auth.ts
├── use-tickets.ts
├── use-media-query.ts
└── index.ts
```

### Store (State Management)
```
src/lib/store/
├── auth.store.ts
├── ui.store.ts
└── index.ts
```

### Utils
```
src/lib/utils/
├── cn.ts                      # Tailwind merge
├── format.ts                  # Formatters
├── validation.ts              # Validators
└── index.ts
```

## 🚀 Cấu trúc chuẩn cho Ticket Management System

```
apps/frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       └── login-form.tsx
│   │   │   └── register/
│   │   │       ├── page.tsx
│   │   │       └── _components/
│   │   │           └── register-form.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── _components/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   └── stats-card.tsx
│   │   │   │
│   │   │   ├── tickets/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── _components/
│   │   │   │   │       ├── ticket-detail.tsx
│   │   │   │   │       ├── comment-list.tsx
│   │   │   │   │       └── attachment-list.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── _components/
│   │   │   │       ├── ticket-list.tsx
│   │   │   │       ├── ticket-card.tsx
│   │   │   │       └── ticket-filters.tsx
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── _components/
│   │   │   │       └── user-table.tsx
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       └── category-list.tsx
│   │   │   │
│   │   │   ├── knowledge/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── _components/
│   │   │   │       └── article-list.tsx
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       └── _components/
│   │   │           └── settings-form.tsx
│   │   │
│   │   ├── api/
│   │   │   └── health/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── toast.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── providers/
│   │       ├── query-provider.tsx
│   │       ├── toast-provider.tsx
│   │       └── index.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── ticket.service.ts
│   │   │       ├── user.service.ts
│   │   │       ├── category.service.ts
│   │   │       ├── knowledge.service.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-tickets.ts
│   │   │   ├── use-users.ts
│   │   │   ├── use-toast.ts
│   │   │   ├── use-modal.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── store/
│   │   │   ├── auth.store.ts
│   │   │   ├── ui.store.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   ├── constants.ts
│   │   │   └── index.ts
│   │   │
│   │   └── config/
│   │       ├── site.ts
│   │       └── env.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   └── form.types.ts
│   │
│   └── middleware.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .eslintrc.json
└── package.json
```

## 🎯 Key Principles

### 1. Route Groups cho Organization
- `(auth)` - Authentication pages
- `(dashboard)` - Protected dashboard pages
- Không ảnh hưởng URL structure

### 2. Private Folders (_prefix)
- `_components/` - Components chỉ dùng trong route đó
- `_lib/` - Utilities chỉ dùng trong route đó
- Không tạo route segments

### 3. Colocation
- Đặt components gần nơi sử dụng
- Shared components trong `src/components/`
- Route-specific components trong `_components/`

### 4. File Conventions
- `page.tsx` - Route page
- `layout.tsx` - Shared layout
- `loading.tsx` - Loading state
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page

### 5. API Routes
- Trong `app/api/`
- File name: `route.ts`
- Export: GET, POST, PUT, DELETE, etc.

## 📝 Import Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage:
```typescript
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { ticketService } from '@/lib/api/services';
import type { Ticket } from '@/types';
```

## 🚀 Benefits

### 1. Clear Organization
- ✅ Route structure rõ ràng
- ✅ Components được tổ chức theo feature
- ✅ Dễ tìm và maintain

### 2. Scalability
- ✅ Dễ thêm routes mới
- ✅ Dễ thêm features mới
- ✅ Không conflict khi team lớn

### 3. Performance
- ✅ Automatic code splitting
- ✅ Lazy loading
- ✅ Optimized bundles

### 4. Developer Experience
- ✅ Type safety
- ✅ Auto-completion
- ✅ Clear conventions

## 📚 References

- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [App Router](https://nextjs.org/docs/app)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
- [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Private Folders](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders)
