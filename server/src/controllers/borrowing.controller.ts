import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { HttpError } from '../middleware/error.middleware';
import { CreateBorrowingDto, ReturnBookDto } from '../types';

const prisma = new PrismaClient();

export const borrowBook = async (
  req: Request<{}, {}, CreateBorrowingDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, bookId } = req.body;

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new HttpError(404, 'Book not found');
    }

    if (book.availableQuantity < 1) {
      throw new HttpError(400, 'Book is not available for borrowing');
    }

    // check user exist
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    // check if user already has this book
    const existingBorrowing = await prisma.borrowingRecord.findFirst({
      where: {
        userId,
        bookId,
        returnDate: null,
      },
    });

    if (existingBorrowing) {
      throw new HttpError(400, 'User already has this book');
    }

    // create borrowing record and update book availability
    const borrowing = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const borrowingRecord = await tx.borrowingRecord.create({
        data: {
          userId,
          bookId,
        },
        include: {
          user: true,
          book: true,
        },
      });

      // update book availability
      await tx.book.update({
        where: { id: bookId },
        data: {
          availableQuantity: {
            decrement: 1,
          },
        },
      });

      return borrowingRecord;
    });

    res.status(201).json({
      status: 'success',
      data: borrowing,
    });
  } catch (error) {
    next(error);
  }
};

export const returnBook = async (
  req: Request<{ id: string }, {}, ReturnBookDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const borrowingId = parseInt(req.params.id);
    const { rating } = req.body;

    // checking if borrowing record exists
    const borrowing = await prisma.borrowingRecord.findUnique({
      where: { id: borrowingId },
    });

    if (!borrowing) {
      throw new HttpError(404, 'Borrowing record not found');
    }

    if (borrowing.returnDate) {
      throw new HttpError(400, 'Book has already been returned');
    }

    // return book and update book availability
    const updatedBorrowing = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update borrowing record
      const returnedBorrowing = await tx.borrowingRecord.update({
        where: { id: borrowingId },
        data: {
          returnDate: new Date(),
          rating,
        },
        include: {
          user: true,
          book: true,
        },
      });

      // updating book availability
      await tx.book.update({
        where: { id: borrowing.bookId },
        data: {
          availableQuantity: {
            increment: 1,
          },
        },
      });

      return returnedBorrowing;
    });

    res.status(200).json({
      status: 'success',
      data: updatedBorrowing,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBorrowings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const borrowings = await prisma.borrowingRecord.findMany({
      include: {
        user: true,
        book: true,
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });

    res.status(200).json({
      status: 'success',
      data: borrowings,
    });
  } catch (error) {
    next(error);
  }
};

export const getBorrowingById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const borrowing = await prisma.borrowingRecord.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true,
        book: true,
      },
    });

    if (!borrowing) {
      throw new HttpError(404, 'Borrowing record not found');
    }

    res.status(200).json({
      status: 'success',
      data: borrowing,
    });
  } catch (error) {
    next(error);
  }
}; 