import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { HttpError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      throw new HttpError(500, 'Failed to fetch users');
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      res.json(user);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(500, 'Failed to fetch user');
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { firstName, lastName, email } = req.body;
      const user = await prisma.user.create({
        data: { firstName, lastName, email },
      });
      res.status(201).json(user);
    } catch (error) {
      throw new HttpError(500, 'Failed to create user');
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email } = req.body;
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { firstName, lastName, email },
      });
      res.json(user);
    } catch (error) {
      throw new HttpError(500, 'Failed to update user');
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      throw new HttpError(500, 'Failed to delete user');
    }
  }

  async getUserBorrowings(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const borrowings = await prisma.borrowingRecord.findMany({
        where: { userId: parseInt(id) },
        include: {
          book: true,
        },
      });
      res.json(borrowings);
    } catch (error) {
      throw new HttpError(500, 'Failed to fetch user borrowings');
    }
  }
} 