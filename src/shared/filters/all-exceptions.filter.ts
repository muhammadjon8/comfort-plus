import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios';
import { Request } from 'express';
import { DateTime } from 'luxon';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let name = 'Error';
    if (exception instanceof AxiosError) {
      httpStatus = exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      if (exception.response?.data) {
        httpAdapter.reply(response, exception.response.data, httpStatus);
        return;
      }
      name = exception.name;
      message = exception.message || 'Axios Request Failed';
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = this.getExceptionMessage(exception);
      name = exception.name;
    }
    const responseBody = {
      error: { status: httpStatus, name, message },
      timestamp: DateTime.now().toISO(),
      path: httpAdapter.getRequestUrl(request),
      requestId: request.headers['x-request-id'],
    };
    httpAdapter.reply(response, responseBody, httpStatus);
  }
  private getExceptionMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'object' && 'message' in response) {
      return response.message as string;
    }
    return exception.message;
  }
}
