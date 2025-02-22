import { Router } from 'express';
import {
  borrowBook,
  returnBook,
  getAllBorrowings,
  getBorrowingById
} from '../controllers/borrowing.controller';

const router = Router();

router.post('/borrow', borrowBook);
router.post('/:id/return', returnBook);
router.get('/', getAllBorrowings);
router.get('/:id', getBorrowingById);

export { router as borrowingRouter }; 