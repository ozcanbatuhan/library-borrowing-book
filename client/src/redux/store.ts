import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import booksReducer from './slices/booksSlice';
import borrowingsReducer from './slices/borrowingsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    books: booksReducer,
    borrowings: borrowingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 