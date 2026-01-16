import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip;
    const userId = request.user?.id || 'anonymous';

    const now = Date.now();

    // Log incoming request
    this.logger.log(
      `Incoming Request: ${method} ${url} - User: ${userId} - IP: ${ip} - UserAgent: ${userAgent}`,
    );

    // Log request details in development
    if (process.env['NODE_ENV'] === 'development') {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
      this.logger.debug(`Query Params: ${JSON.stringify(query)}`);
      this.logger.debug(`Route Params: ${JSON.stringify(params)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${response.statusCode} - ${responseTime}ms - User: ${userId}`,
          );

          // Log response data in development (be careful with sensitive data)
          if (process.env['NODE_ENV'] === 'development' && data) {
            const logData = this.sanitizeLogData(data);
            this.logger.debug(`Response Data: ${JSON.stringify(logData)}`);
          }
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `Request Error: ${method} ${url} - ${error.status || 500} - ${responseTime}ms - User: ${userId} - Error: ${error.message}`,
          );
        },
      }),
    );
  }

  /**
   * Remove sensitive data from logs
   * @param data - Response data
   * @param seen - Set to track circular references
   * @returns Sanitized data
   */
  private sanitizeLogData(data: any, seen = new WeakSet()): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Check for circular reference
    if (seen.has(data)) {
      return '[Circular]';
    }

    seen.add(data);

    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret'];
    const sanitized = Array.isArray(data) ? [] : { ...data };

    // Remove sensitive fields
    if (!Array.isArray(data)) {
      sensitiveFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      });
    }

    // Handle nested objects
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeLogData(sanitized[key], seen);
      }
    });

    return sanitized;
  }
}