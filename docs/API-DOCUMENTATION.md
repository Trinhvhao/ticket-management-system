# API Documentation

## Swagger/OpenAPI Documentation

The backend API is fully documented using Swagger/OpenAPI specification.

### Access Documentation

Once the server is running, access the interactive API documentation at:

```
http://localhost:3000/api/docs
```

### Features

- **Interactive API Explorer**: Test all endpoints directly from the browser
- **Authentication**: JWT Bearer token authentication with "Authorize" button
- **Request/Response Examples**: See example payloads for all endpoints
- **Schema Definitions**: View all DTOs and entity structures
- **Grouped by Tags**: Endpoints organized by module (auth, tickets, users, etc.)

## API Modules

### Authentication (`/api/v1/auth`)
- User login and registration
- JWT token management (access & refresh tokens)
- User profile retrieval
- Logout functionality

### Tickets (`/api/v1/tickets`)
- Create, read, update, delete tickets
- Ticket assignment and status management
- Filtering and pagination
- Statistics and reporting
- Rating system

### Users (`/api/v1/users`)
- User management (Admin only)
- Profile management
- Password changes
- Department and role filtering
- User statistics

### Categories (`/api/v1/categories`)
- Category CRUD operations
- Category activation/deactivation
- Reordering categories
- Category statistics

### Comments (`/api/v1/tickets/:ticketId/comments`)
- Add comments to tickets
- View ticket comments
- Update/delete own comments
- Comment statistics

### Knowledge Base (`/api/v1/knowledge`)
- Article CRUD operations
- Search functionality
- Popular and recent articles
- Article rating system
- Category and tag filtering
- Public access for published articles

### Chatbot (`/api/v1/chatbot`)
- AI-powered chat interface
- Knowledge base integration
- Intent detection
- Contextual responses

## Authentication

Most endpoints require JWT authentication. To authenticate:

1. Login via `/api/v1/auth/login` to get access token
2. Click "Authorize" button in Swagger UI
3. Enter: `Bearer <your-access-token>`
4. All subsequent requests will include the token

## Role-Based Access Control

- **EMPLOYEE**: Can create tickets, view own tickets, add comments
- **IT_STAFF**: Can view all tickets, assign tickets, resolve tickets, manage knowledge base
- **ADMIN**: Full system access including user management and system configuration

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Testing the API

### Using Swagger UI
1. Start the backend server: `npm run dev`
2. Open browser: `http://localhost:3000/api/docs`
3. Click "Authorize" and enter JWT token
4. Test endpoints interactively

### Using PowerShell Scripts
Test scripts are available in `apps/backend/`:
- `test-all-modules.ps1` - Test all modules
- `test-knowledge-module.ps1` - Test knowledge base module

### Using cURL or Postman
Import the OpenAPI specification from `/api/docs-json` endpoint.

## Rate Limiting

API endpoints are protected with rate limiting to prevent abuse. Default limits:
- 100 requests per 15 minutes per IP address

## CORS Configuration

CORS is configured to allow requests from the frontend application. Default origin:
- `http://localhost:5173` (Vite dev server)

Configure via `CORS_ORIGIN` environment variable.

## Database

- **Type**: PostgreSQL 8.0+
- **ORM**: Sequelize with sequelize-typescript
- **Schema**: See `apps/backend/database/schema-postgres.sql`

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Server
PORT=3000
NODE_ENV=development
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=ticket_system

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true
```

## Support

For issues or questions about the API:
1. Check Swagger documentation at `/api/docs`
2. Review source code in `apps/backend/src/modules/`
3. Check database schema in `apps/backend/database/schema-postgres.sql`
