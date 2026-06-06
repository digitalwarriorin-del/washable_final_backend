import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(500).json({
      success: false,
      message: exception.message,
    });
  }
}