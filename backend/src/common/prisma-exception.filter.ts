import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    // Prisma unique constraint
    if (exception?.code === 'P2002') {
      const meta = (exception as Prisma.PrismaClientKnownRequestError).meta as any;
      const target = Array.isArray(meta?.target) ? meta.target : [];
      const message = target.includes('email') ? 'Email already exists' : 'Unique constraint failed';
      res.status(HttpStatus.CONFLICT).json({ message });
      return;
    }

    // If it's already an HttpException from Nest, try to pass through
    const status = exception?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.response?.message || exception?.message || 'Internal server error';
    res.status(status).json({ message });
  }
}
