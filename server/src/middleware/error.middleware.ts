import { ErrorRequestHandler } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    //  Prisma specific errors here - maybe add later (optioanls)
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'fail',
        message: 'A record with this unique constraint already exists.',
      });
    }
  }

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal server error',
  });
}; 