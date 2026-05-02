import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

type PrismaErrorLike = { code?: string };

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      response.status(status).json(exceptionResponse);
      return;
    }

    const maybePrisma = exception as PrismaErrorLike;
    if (maybePrisma?.code?.startsWith('P')) {
      const mapped = this.mapCode(maybePrisma.code);
      response.status(mapped.status).json({
        statusCode: mapped.status,
        error: mapped.error,
        message: mapped.message,
        prismaCode: maybePrisma.code,
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Erro interno do servidor.',
    });
  }

  private mapCode(code: string) {
    if (code === 'P2025') return { status: HttpStatus.NOT_FOUND, error: 'Not Found', message: 'Registro não encontrado.' };
    if (code === 'P2002') return { status: HttpStatus.CONFLICT, error: 'Conflict', message: 'Registro duplicado.' };
    if (code === 'P2003') return { status: HttpStatus.BAD_REQUEST, error: 'Bad Request', message: 'Violação de referência entre tabelas.' };
    return { status: HttpStatus.BAD_REQUEST, error: 'Bad Request', message: 'Erro de banco de dados.' };
  }
}
