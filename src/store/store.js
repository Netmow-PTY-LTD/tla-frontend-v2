import { configureStore } from '@reduxjs/toolkit';
import { servicesSlice } from './slices/super-admin/servicesSlice';
import { authSlice } from './slices/public/authSlice';

export const store = configureStore({
  reducer: {
    [servicesSlice.reducerPath]: servicesSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authSlice.middleware)
      .concat(servicesSlice.middleware),
});
