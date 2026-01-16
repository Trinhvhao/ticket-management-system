import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
    constructor(private configService: ConfigService) {}

    @Get()
    getRoot() {
        return {
            message: 'Ticket Management System API',
            version: this.configService.get<string>('API_VERSION') || 'v1',
            status: 'running',
            timestamp: new Date().toISOString(),
        };
    }

    @Get('health')
    getHealth() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: 'connected',
        };
    }

    @Get('docs')
    getDocs() {
        return {
            message: 'API Documentation',
            baseUrl: `/api/${this.configService.get<string>('API_VERSION') || 'v1'}`,
            endpoints: {
                root: {
                    method: 'GET',
                    path: '/',
                    description: 'API information',
                },
                health: {
                    method: 'GET',
                    path: '/health',
                    description: 'Health check endpoint',
                },
                docs: {
                    method: 'GET',
                    path: '/docs',
                    description: 'API documentation',
                },
            },
            modules: {
                auth: 'Authentication & Authorization (Coming soon)',
                users: 'User management (Coming soon)',
                tickets: 'Ticket management (Coming soon)',
                categories: 'Category management (Coming soon)',
                comments: 'Comment management (Coming soon)',
                attachments: 'File attachments (Coming soon)',
                knowledge: 'Knowledge base (Coming soon)',
                notifications: 'Notifications (Coming soon)',
                dashboard: 'Dashboard & Analytics (Coming soon)',
            },
        };
    }
}
