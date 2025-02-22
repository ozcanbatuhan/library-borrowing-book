import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BorrowingRecord } from '../../types';
import { borrowingApi } from '../../services/api';

interface BorrowingsState {
  borrowings: BorrowingRecord[];
  selectedBorrowing: BorrowingRecord | null;
  loading: boolean;
  error: string | null;
}

const initialState: BorrowingsState = {
  borrowings: [],
  selectedBorrowing: null,
  loading: false,
  error: null,
};

export const fetchBorrowings = createAsyncThunk<BorrowingRecord[]>(
  'borrowings/fetchBorrowings',
  async () => {
    const response = await borrowingApi.getAll();
    return response.data || [];
  }
);

export const fetchBorrowingById = createAsyncThunk<BorrowingRecord, number>(
  'borrowings/fetchBorrowingById',
  async (id) => {
    const response = await borrowingApi.getById(id);
    return response.data;
  }
);

export const borrowBook = createAsyncThunk<BorrowingRecord, { userId: number; bookId: number }>(
  'borrowings/borrowBook',
  async ({ userId, bookId }) => {
    const response = await borrowingApi.borrow(userId, bookId);
    return response.data;
  }
);

interface ReturnBookParams {
  bookId: number;
  borrowingId: number;
  rating?: number;
}

export const returnBook = createAsyncThunk<BorrowingRecord, ReturnBookParams>(
  'borrowings/returnBook',
  async ({ bookId, borrowingId, rating }) => {
    const response = await borrowingApi.return(bookId, borrowingId, rating);
    return response.data;
  }
);

const borrowingsSlice = createSlice({
  name: 'borrowings',
  initialState,
  reducers: {
    clearSelectedBorrowing: (state) => {
      state.selectedBorrowing = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch borrowings logs
      .addCase(fetchBorrowings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBorrowings.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowings = action.payload;
      })
      .addCase(fetchBorrowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch borrowings';
      })
      // Fetch Borrowing by id
      .addCase(fetchBorrowingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBorrowingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBorrowing = action.payload;
      })
      .addCase(fetchBorrowingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch borrowing';
      })
      // Borrow Book
      .addCase(borrowBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(borrowBook.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowings.unshift(action.payload);
      })
      .addCase(borrowBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to borrow book';
      })
      // returning the book
      .addCase(returnBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.borrowings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.borrowings[index] = action.payload;
        }
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to return book';
      });
  },
});

export const { clearSelectedBorrowing, clearError } = borrowingsSlice.actions;
export default borrowingsSlice.reducer; 