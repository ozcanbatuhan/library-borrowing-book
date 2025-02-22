export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  quantity: number;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  isbn?: string;
  publishYear?: number;
  quantity?: number;
}

export interface CreateBorrowingDto {
  userId: number;
  bookId: number;
}

export interface ReturnBookDto {
  rating?: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
} 