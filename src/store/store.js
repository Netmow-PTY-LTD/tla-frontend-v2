import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/super-admin/apiSlice';
import { authSlice } from './slices/public/authSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authSlice.middleware)
      .concat(apiSlice.middleware),
});
