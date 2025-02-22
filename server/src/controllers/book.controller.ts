import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { HttpError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export class BookController {
  async getAllBooks(req: Request, res: Response) {
    try {
      const books = await prisma.book.findMany();
      res.json(books);
    } catch (error) {
      throw new HttpError(500, 'Failed to fetch books');
    }
  }

  async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await prisma.book.findUnique({
        where: { id: parseInt(id) },
      });

      if (!book) {
        throw new HttpError(404, 'Book not found');
      }

      // get borrowing history with user details
      const borrowingHistory = await prisma.borrowingRecord.findMany({
        where: {
          bookId: book.id,
        },
        include: {
          user: true,
        },
        orderBy: {
          borrowDate: 'desc',
        },
      });

      // get current borrower if exists
      const currentBorrowing = await prisma.borrowingRecord.findFirst({
        where: {
          bookId: book.id,
          returnDate: null,
        },
        include: {
          user: true,
        },
      });

      // calculate average score of book
      const bookRatings = await prisma.borrowingRecord.findMany({
        where: {
          bookId: book.id,
          rating: {
            not: null,
          },
        },
        select: {
          rating: true,
        },
      });

      const averageRating = bookRatings.length > 0
        ? bookRatings.reduce((acc: number, curr) => 
            acc + (curr.rating ? parseFloat(curr.rating.toString()) : 0), 0) / bookRatings.length
        : -1;

      res.json({
        ...book,
        currentBorrower: currentBorrowing?.user || null,
        averageRating,
        borrowingHistory,
      });
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(500, 'Failed to fetch book');
    }
  }

  async createBook(req: Request, res: Response) {
    try {
      const { title, author, isbn, publishYear, quantity } = req.body;
      const book = await prisma.book.create({
        data: {
          title,
          author,
          isbn,
          publishYear: parseInt(publishYear),
          quantity: parseInt(quantity),
          availableQuantity: parseInt(quantity),
        },
      });
      res.status(201).json(book);
    } catch (error) {
      throw new HttpError(500, 'Failed to create book');
    }
  }

  async updateBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, author, isbn, publishYear, quantity } = req.body;
      const book = await prisma.book.update({
        where: { id: parseInt(id) },
        data: {
          title,
          author,
          isbn,
          publishYear: parseInt(publishYear),
          quantity: parseInt(quantity),
        },
      });
      res.json(book);
    } catch (error) {
      throw new HttpError(500, 'Failed to update book');
    }
  }

  async deleteBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.book.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      throw new HttpError(500, 'Failed to delete book');
    }
  }

  async getBookBorrowings(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const borrowings = await prisma.borrowingRecord.findMany({
        where: { bookId: parseInt(id) },
        include: {
          user: true,
        },
      });
      res.json(borrowings);
    } catch (error) {
      throw new HttpError(500, 'Failed to fetch book borrowings');
    }
  }

  async borrowBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const book = await prisma.book.findUnique({
        where: { id: parseInt(id) },
      });

      if (!book) {
        throw new HttpError(404, 'Book not found');
      }

      // i control for user already borrowed same this book ?
      const existingBorrowing = await prisma.borrowingRecord.findFirst({
        where: {
          bookId: parseInt(id),
          userId: parseInt(userId),
          returnDate: null,
        },
      });

      if (existingBorrowing) {
        throw new HttpError(400, 'You have already borrowed this book');
      }

      if (book.availableQuantity < 1) {
        throw new HttpError(400, 'This book is currently not available for borrowing');
      }


      const borrowing = await prisma.$transaction(async (prisma) => {
       
        const borrowingRecord = await prisma.borrowingRecord.create({
          data: {
            userId: parseInt(userId),
            bookId: parseInt(id),
            borrowDate: new Date(),
          },
        });

        await prisma.book.update({
          where: { id: parseInt(id) },
          data: {
            availableQuantity: book.availableQuantity - 1,
          },
        });

        return borrowingRecord;
      });

      res.status(201).json(borrowing);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error('Error in borrowBook:', error);
      throw new HttpError(500, 'Failed to borrow book');
    }
  }

  async returnBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { borrowingId, rating } = req.body;

      const [book, borrowing] = await Promise.all([
        prisma.book.findUnique({
          where: { id: parseInt(id) },
        }),
        prisma.borrowingRecord.findUnique({
          where: { id: parseInt(borrowingId) },
        }),
      ]);

      if (!book || !borrowing) {
        throw new HttpError(404, 'Book or borrowing record not found');
      }

      await prisma.borrowingRecord.update({
        where: { id: parseInt(borrowingId) },
        data: {
          returnDate: new Date(),
          rating: rating ? parseFloat(parseFloat(rating).toFixed(1)) : null,
        },
      });

      await prisma.book.update({
        where: { id: parseInt(id) },
        data: {
          availableQuantity: book.availableQuantity + 1,
        },
      });

      res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(500, 'Failed to return book');
    }
  }
} 