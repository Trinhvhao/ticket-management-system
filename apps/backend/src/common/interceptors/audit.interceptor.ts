import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService } from '../services/audit-log.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;
    const body = request.body;

    // Skip audit for non-authenticated requests
    if (!user) {
      return next.handle();
    }

    // Determine action from HTTP method and URL
    const action = this.getAction(method, url);
    const entityType = this.getEntityType(url);
    const entityId = this.getEntityId(url);

    // Skip audit for GET requests (too noisy)
    if (method === 'GET') {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async () => {
        // Log successful action
        await this.auditLogService.log({
          userId: user.id,
          action,
          entityType,
          entityId: entityId || undefined,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          details: {
            method,
            url,
            body: this.sanitizeBody(body),
            success: true,
          },
        });
      }),
      catchError((error) => {
        // Log failed action
        this.auditLogService.log({
          userId: user.id,
          action,
          entityType,
          entityId: entityId || undefined,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          details: {
            method,
            url,
            body: this.sanitizeBody(body),
            success: false,
            error: error.message,
          },
        });
        return throwError(() => error);
      }),
    );
  }

  private getAction(method: string, url: string): string {
    const entityType = this.getEntityType(url).toUpperCase();

    switch (method) {
      case 'POST':
        return `CREATE_${entityType}`;
      case 'PATCH':
      case 'PUT':
        return `UPDATE_${entityType}`;
      case 'DELETE':
        return `DELETE_${entityType}`;
      default:
        return `${method}_${entityType}`;
    }
  }

  private getEntityType(url: string): string {
    // Extract entity type from URL
    // /api/tickets/123 -> ticket
    // /api/users/456 -> user
    const match = url.match(/\/api\/([^\/]+)/);
    if (match && match[1]) {
      const resource = match[1];
      // Singularize and capitalize
      return resource.endsWith('s')
        ? resource.slice(0, -1)
        : resource;
    }
    return 'unknown';
  }

  private getEntityId(url: string): number | undefined {
    // Extract entity ID from URL
    // /api/tickets/123 -> 123
    const match = url.match(/\/(\d+)(?:\/|$)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return undefined;
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;

    // Remove sensitive fields
    const sanitized = { ...body };
    delete sanitized.password;
    delete sanitized.currentPassword;
    delete sanitized.newPassword;
    delete sanitized.token;

    return sanitized;
  }
}
