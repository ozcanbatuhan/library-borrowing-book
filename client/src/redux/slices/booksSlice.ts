import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Book, BookDetails } from '../../types';
import { bookApi } from '../../services/api';

interface BooksState {
  books: Book[];
  selectedBook: BookDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  selectedBook: null,
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const response = await bookApi.getAll();
  return response.data;
});

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId: number) => {
    const response = await bookApi.getById(bookId);
    return response.data;
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch books';
      })
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch book';
      });
  },
});

export const { clearSelectedBook, clearError } = booksSlice.actions;
export default booksSlice.reducer; 