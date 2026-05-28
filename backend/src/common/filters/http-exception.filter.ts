import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();
      if (typeof exResponse === 'string') {
        message = exResponse;
        error = exception.name;
      } else if (typeof exResponse === 'object') {
        const resp = exResponse as Record<string, any>;
        message = Array.isArray(resp.message) ? resp.message.join('; ') : (resp.message || 'Error');
        error = resp.error || exception.name;
      } else {
        message = 'Error';
        error = exception.name;
      }
    } else if (
      exception instanceof Error &&
      'code' in exception &&
      typeof (exception as any).code === 'string' &&
      (exception as any).code.startsWith('P')
    ) {
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Error';
      const code = (exception as any).code;
      if (code === 'P2002') {
        message = 'Data sudah ada';
      } else if (code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Data tidak ditemukan';
      } else {
        message = 'Kesalahan database';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Terjadi kesalahan internal server';
      error = 'Internal Server Error';
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
