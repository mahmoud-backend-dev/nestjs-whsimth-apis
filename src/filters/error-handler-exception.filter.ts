import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { unlink } from 'fs/promises';
@Catch(Error)
export class ErrorHandlerExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost) {
    const customError: object = {
      message: exception['message'] || 'Something went wrong try again later',
      statusCode: exception['status'] || HttpStatus.INTERNAL_SERVER_ERROR,
    };
    const response: Response = host.switchToHttp().getResponse<Response>();
    const request: Request = host.switchToHttp().getRequest<Request>();
    if (exception['name'] === 'ValidationError') {
      customError['message'] = Object.values(exception['errors']).map(
        (value: any) => value.message,
      );
      customError['statusCode'] = HttpStatus.BAD_REQUEST;
    }
    if (exception['code'] && exception['code'] === 11000) {
      customError['message'] = `Duplicate value entered for ${Object.keys(
        exception['keyValue'],
      )}, please choose another value`;
      customError['statusCode'] = HttpStatus.BAD_REQUEST;
    }
    if (exception['name'] === 'CastError') {
      customError['message'] = `No item found with id ${exception['value']}`;
      customError['statusCode'] = HttpStatus.BAD_REQUEST;
    }
    if (exception['name'] === 'TokenExpiredError') {
      customError['message'] = `Token expired, please login again...`;
      customError['statusCode'] = HttpStatus.UNAUTHORIZED;
    }
    if (exception['name'] === 'JsonWebTokenError') {
      customError['message'] = `Invalid token, please login again...`;
      customError['statusCode'] = HttpStatus.UNAUTHORIZED;
    }
    if (exception['name'] === 'BadRequestException') {
      customError['statusCode'] = HttpStatus.BAD_REQUEST;
      customError['message'] = exception['response']['message'];
    }
    if (process.env.NODE_ENV === 'development')
      customError['stack'] = exception['stack'];
    if (request['file']) {
      await unlink(request['file']['path']);
    }

    response.status(customError['statusCode']).json(customError);
  }
}
