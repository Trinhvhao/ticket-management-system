# Ticket Management System - Frontend

Next.js 14 frontend application for the Ticket Management System.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 + TypeScript
- **Styling:** TailwindCSS + Shadcn UI
- **State:** Zustand + TanStack Query
- **Icons:** Lucide React
- **Animations:** Framer Motion

## Prerequisites

- Node.js 18.x or later
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your backend API URL
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Ticket Management System
NEXT_PUBLIC_COMPANY_NAME=TNHH 28H
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

## Development

```bash
# Start development server
npm run dev

# Open http://localhost:3001
```

## Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (dashboard)/       # Dashboard layout group
│   │   ├── tickets/       # Ticket pages
│   │   ├── users/         # User management
│   │   ├── reports/       # Reports & analytics
│   │   └── ...
│   ├── login/             # Auth pages
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── charts/           # Chart components
│   └── ...
├── lib/                   # Utilities
│   ├── api/              # API services
│   ├── stores/           # Zustand stores
│   ├── hooks/            # Custom hooks
│   └── types/            # TypeScript types
└── styles/               # Global styles
```

## Features

- ✅ Authentication (JWT)
- ✅ Ticket Management (CRUD, Kanban, Calendar)
- ✅ User Management
- ✅ Reports & Analytics
- ✅ SLA Management
- ✅ Auto-Escalation
- ✅ Knowledge Base
- ✅ Chatbot Widget
- ✅ Notifications
- ✅ Responsive Design

## Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/login` | Login page | Public |
| `/register` | Register page | Public |
| `/dashboard` | Main dashboard | Authenticated |
| `/tickets` | Ticket list | Authenticated |
| `/tickets/[id]` | Ticket detail | Authenticated |
| `/users` | User management | Admin |
| `/reports` | Reports | IT Staff/Admin |
| `/escalation` | Escalation rules | Admin |

## API Integration

All API calls go through `src/lib/api/client.ts` which handles:
- JWT token management
- Auto token refresh
- Error handling
- Request/response interceptors

## Deployment

See `docs/DEPLOYMENT-GUIDE.md` for production deployment instructions.

## License

© 2026 TNHH 28H
