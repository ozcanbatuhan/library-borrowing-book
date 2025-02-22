import { Router } from 'express';
import { BookController } from '../controllers/book.controller';

const router = Router();
const bookController = new BookController();

// get all book
router.get('/', bookController.getAllBooks);

// get book by id
router.get('/:id', bookController.getBookById);

// new book
router.post('/', bookController.createBook);

// update Book
router.put('/:id', bookController.updateBook);

// delete
router.delete('/:id', bookController.deleteBook);

// borrowed before books
router.get('/:id/borrowings', bookController.getBookBorrowings);

// borrow book
router.post('/:id/borrow', bookController.borrowBook);

// return book to library
router.post('/:id/return', bookController.returnBook);

export default router; 