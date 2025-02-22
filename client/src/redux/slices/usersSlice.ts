import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User, BorrowingRecord } from '../../types';
import { userApi } from '../../services/api';

interface UsersState {
  users: User[];
  selectedUser: User | null;
  borrowingHistory: BorrowingRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  borrowingHistory: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await userApi.getAll();
  return response.data;
});

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: number) => {
    const response = await userApi.getById(userId);
    return response.data;
  }
);

export const fetchUserBorrowingHistory = createAsyncThunk(
  'users/fetchUserBorrowingHistory',
  async (userId: number) => {
    const response = await userApi.getBorrowingHistory(userId);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.borrowingHistory = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(fetchUserBorrowingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBorrowingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowingHistory = action.payload;
      })
      .addCase(fetchUserBorrowingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch borrowing history';
      });
  },
});

export const { clearSelectedUser, clearError } = usersSlice.actions;
export default usersSlice.reducer; 