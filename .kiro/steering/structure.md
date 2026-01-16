# Project Structure & Organization

## Root Directory Layout
```
ticket-management-system/
├── backend/                 # Node.js/Express API server
├── frontend/               # React.js client application
├── docs/                   # Documentation và specs
├── .kiro/                  # Kiro configuration và specs
├── README.md
└── package.json           # Root package.json cho scripts chung
```

## Backend Structure (`/backend`)
```
backend/
├── src/
│   ├── modules/           # NestJS feature modules
│   │   ├── auth/          # Authentication module
│   │   ├── tickets/       # Ticket management module
│   │   ├── users/         # User management module
│   │   ├── categories/    # Category module
│   │   ├── knowledge/     # Knowledge base module
│   │   ├── comments/      # Comments module
│   │   ├── attachments/   # File attachments module
│   │   ├── notifications/ # Notifications module
│   │   ├── reports/       # Reports module
│   │   ├── sla/           # SLA management module
│   │   ├── ticket-history/# Ticket history module
│   │   └── chatbot/       # AI Chatbot module
│   ├── common/            # Shared utilities
│   │   ├── guards/        # Authentication guards
│   │   ├── interceptors/  # Request/response interceptors
│   │   ├── decorators/    # Custom decorators
│   │   ├── filters/       # Exception filters
│   │   └── services/      # Shared services (email, etc)
│   ├── database/          # Database configuration
│   │   └── entities/      # Sequelize entities
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   ├── app.controller.ts  # Root controller
│   ├── app.module.ts      # Root application module
│   └── main.ts            # Application bootstrap
├── migrations/            # Sequelize database migrations
├── db/                   # Database schemas
├── docs/                 # API documentation
├── uploads/              # File upload storage (local)
│   └── attachments/      # Ticket attachments
└── package.json
```

## Frontend Structure (`/frontend`)
```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable React components
│   │   ├── common/       # Shared UI components
│   │   ├── ticket/       # Ticket-related components
│   │   ├── user/         # User management components
│   │   └── dashboard/    # Dashboard components
│   ├── pages/            # Page-level components
│   ├── services/         # API service functions
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── styles/           # CSS/SCSS files
│   ├── App.js            # Main App component
│   └── index.js          # Entry point
├── tests/                # React Testing Library tests
└── package.json
```

## Key Directories Explained

### `/backend/src/modules/`
- NestJS feature modules cho từng domain
- Naming: kebab-case directories (auth/, tickets/, users/)
- Mỗi module có controller, service, module file

### `/backend/src/database/entities/`
- Sequelize entities cho database tables
- Naming: kebab-case files (user.entity.ts, ticket.entity.ts)
- Include associations và validations
- Export tất cả entities từ index.ts

### `/backend/src/common/`
- Shared utilities across modules
- Guards cho authentication/authorization
- Interceptors cho logging, transformation
- Filters cho exception handling

### `/frontend/src/components/`
- Reusable React components
- Naming: PascalCase directories và files
- Each component trong own directory với index.js

### `/frontend/src/pages/`
- Top-level page components
- Naming: PascalCase (TicketList.js, Dashboard.js)
- Route-level components

## File Naming Conventions

### Backend Files (NestJS)
- **Entities**: kebab-case + .entity.ts (user.entity.ts, ticket.entity.ts)
- **Controllers**: kebab-case + .controller.ts (users.controller.ts)
- **Services**: kebab-case + .service.ts (tickets.service.ts)
- **Modules**: kebab-case + .module.ts (auth.module.ts)
- **DTOs**: kebab-case + .dto.ts (create-user.dto.ts)
- **Guards**: kebab-case + .guard.ts (jwt-auth.guard.ts)
- **Decorators**: kebab-case + .decorator.ts (current-user.decorator.ts)

### Frontend Files
- **Components**: PascalCase directories và files
- **Pages**: PascalCase (Dashboard.js, TicketForm.js)
- **Services**: camelCase (apiService.js, authService.js)
- **Hooks**: camelCase với use prefix (useAuth.js, useTickets.js)

## Configuration Files Location
- **Environment**: `.env` files trong root directories
- **Database**: `backend/src/config/database.js`
- **Express**: `backend/src/config/express.js`
- **React**: `frontend/src/config/` cho app configuration

## Testing Structure
- **Backend tests**: Mirror src structure trong `backend/tests/`
- **Frontend tests**: Co-located với components hoặc trong `frontend/tests/`
- **Integration tests**: `tests/integration/` trong root

## Documentation Location
- **API docs**: `docs/api/`
- **User guides**: `docs/user/`
- **Technical specs**: `.kiro/specs/`
- **README files**: Trong mỗi major directory