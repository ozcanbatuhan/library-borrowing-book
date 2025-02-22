export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  quantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowingRecord {
  id: number;
  userId: number;
  bookId: number;
  borrowDate: string;
  returnDate: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  book?: Book;
}

export interface BookDetails extends Book {
  currentBorrowers: User[];
  averageRating: number | null;
  borrowingHistory: BorrowingRecord[];
}

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
} 