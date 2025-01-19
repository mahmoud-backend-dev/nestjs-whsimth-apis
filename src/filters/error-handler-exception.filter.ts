import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { unlink } from 'fs/promises';
import { ValidationError } from 'class-validator';

@Catch(Error)
export class ErrorHandlerExceptionFilter implements ExceptionFilter {
  async catch(exception: Error | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    // Default error structure
    const customError: Record<string, any> = {
      message: exception.message || 'Something went wrong, try again later',
      status: exception.status || HttpStatus.INTERNAL_SERVER_ERROR,
      stack:
        process.env.NODE_ENV === 'development' ? exception.stack : undefined,
    };

    // Handle validation errors from class-validator
    if (exception instanceof ValidationError || exception.errors) {
      const formatValidationErrors = (error) => {
        if (!error.constraints || Object.keys(error.constraints).length === 0) {
          if (error.children && error.children.length > 0) {
            return error.children.flatMap((child) =>
              formatValidationErrors(child),
            );
          }
          return []; // No constraints and no children, return empty
        }
        return Object.values(error.constraints);
      };

      customError.status = HttpStatus.BAD_REQUEST;
      customError.message = Array.isArray(exception.errors)
        ? exception.errors.map((error) => ({
            property: error.property,
            messages: formatValidationErrors(error || []),
          }))
        : 'Validation failed';
    }

    // Handle MongoDB duplicate key error
    if (exception.code === 11000) {
      customError.status = HttpStatus.BAD_REQUEST;
      customError.message = `Duplicate value entered for ${Object.keys(
        exception.keyValue,
      )}, please choose another value.`;
    }

    // Handle Mongoose cast error
    if (exception.name === 'CastError') {
      customError.status = HttpStatus.BAD_REQUEST;
      customError.message = `No item found with id ${exception.value}`;
    }

    // Handle JWT errors
    if (exception.name === 'TokenExpiredError') {
      customError.status = HttpStatus.UNAUTHORIZED;
      customError.message = 'Token expired, please login again.';
    }

    if (exception.name === 'JsonWebTokenError') {
      customError.status = HttpStatus.UNAUTHORIZED;
      customError.message = 'Invalid token, please login again.';
    }

    // Handle specific NestJS exceptions like BadRequestException
    if (exception.name === 'BadRequestException') {
      customError.status = HttpStatus.BAD_REQUEST;
      customError.message = exception.response?.message || 'Bad request';
    }

    // Handle uploaded files
    if (request.file?.path) {
      try {
        await unlink(request.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete file:', unlinkError);
      }
    }

    // Send the custom error response
    response.status(customError.status).json(customError);
  }
}
