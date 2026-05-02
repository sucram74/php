import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

type PrismaErrorLike = { code?: string };

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const maybePrisma = exception as PrismaErrorLike;
    if (!maybePrisma?.code?.startsWith('P')) throw exception;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const mapped = this.mapCode(maybePrisma.code);

    response.status(mapped.status).json({
      statusCode: mapped.status,
      error: mapped.error,
      message: mapped.message,
      prismaCode: maybePrisma.code,
    });
  }

  private mapCode(code: string) {
    if (code === 'P2025') return { status: HttpStatus.NOT_FOUND, error: 'Not Found', message: 'Registro não encontrado.' };
    if (code === 'P2002') return { status: HttpStatus.CONFLICT, error: 'Conflict', message: 'Registro duplicado.' };
    if (code === 'P2003') return { status: HttpStatus.BAD_REQUEST, error: 'Bad Request', message: 'Violação de referência entre tabelas.' };
    return { status: HttpStatus.BAD_REQUEST, error: 'Bad Request', message: 'Erro de banco de dados.' };
  }
}
