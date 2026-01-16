import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path: string;
  details?: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error details
    const errorDetails: any = typeof exceptionResponse === 'object' 
      ? exceptionResponse 
      : { message: exceptionResponse };

    const errorResponse: ErrorResponse = {
      success: false,
      message: this.getErrorMessage(errorDetails),
      error: exception.name,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Add validation details if available
    if (errorDetails['message'] && Array.isArray(errorDetails['message'])) {
      errorResponse.details = errorDetails['message'];
    }

    // Log error
    const userId = (request as any)['user']?.id || 'anonymous';
    this.logger.error(
      `HTTP Exception: ${request.method} ${request.url} - ${status} - User: ${userId} - ${errorResponse.message}`,
      exception.stack,
    );

    // Send error response
    response.status(status).json(errorResponse);
  }

  private getErrorMessage(errorDetails: any): string {
    if (typeof errorDetails === 'string') {
      return errorDetails;
    }

    if (errorDetails.message) {
      if (Array.isArray(errorDetails.message)) {
        return errorDetails.message.join(', ');
      }
      return errorDetails.message;
    }

    return 'An error occurred';
  }
}