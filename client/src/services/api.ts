import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { User, Book, BorrowingRecord, BookDetails } from '../types';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retries?: number;
  retryDelay?: number;
}

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// User API
export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<User>('/users', data),
  update: (id: number, data: Partial<User>) => 
    api.put<User>(`/users/${id}`, data),
  delete: (id: number) => api.delete<void>(`/users/${id}`),
  getBorrowingHistory: (id: number) => 
    api.get<BorrowingRecord[]>(`/users/${id}/borrowings`),
};

// Book API
export const bookApi = {
  getAll: () => api.get<Book[]>('/books'),
  getById: (id: number) => api.get<BookDetails>(`/books/${id}`),
  create: (data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Book>('/books', data),
  update: (id: number, data: Partial<Book>) => 
    api.put<Book>(`/books/${id}`, data),
  delete: (id: number) => api.delete<void>(`/books/${id}`),
  getBorrowingHistory: (id: number) => 
    api.get<BorrowingRecord[]>(`/books/${id}/borrowings`),
};

// Borrowing API
export const borrowingApi = {
  borrow: (userId: number, bookId: number) => 
    api.post<BorrowingRecord>(`/books/${bookId}/borrow`, { userId }),
  return: (bookId: number, borrowingId: number, rating?: number) => 
    api.post<BorrowingRecord>(`/books/${bookId}/return`, { borrowingId, rating }),
  getAll: () => api.get<BorrowingRecord[]>('/borrowings'),
  getById: (id: number) => api.get<BorrowingRecord>(`/borrowings/${id}`),
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const config = error.config as CustomAxiosRequestConfig;
    config.retries = config.retries ?? 0;
    config.retryDelay = config.retryDelay ?? 1000;

    if (!error.response) {
      console.error('Connection error:', error.message);
      if (config.retries < 2) {
        config.retries += 1;
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return api(config);
      }
      throw new Error('Unable to connect to the server. Please check your connection and try again.');
    }

    const status = error.response.status;
    const backendMessage = error.response.data?.message || JSON.stringify(error.response.data);

    switch (status) {
      case 400:
        throw new Error(backendMessage || 'Invalid request. Please check your input.');
      case 404:
        throw new Error(backendMessage || 'Resource not found.');
      case 500:
        throw new Error(backendMessage || 'Server error. Please try again later.');
      default:
        throw new Error(backendMessage || 'An unexpected error occurred.');
    }
  }
);

export default api; 