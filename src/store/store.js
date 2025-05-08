import { configureStore } from '@reduxjs/toolkit';
import { servicesApiService } from './api/super-admin/servicesApiService';
import { publicApiService } from '@/store/api/public/publicApiService';
import { authApiService } from './api/public/authApiService';

export const store = configureStore({
  reducer: {
    [servicesApiService.reducerPath]: servicesApiService.reducer,
    [authApiService.reducerPath]: authApiService.reducer,
    [publicApiService.reducerPath]: publicApiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiService.middleware)
      .concat(servicesApiService.middleware)
      .concat(publicApiService.middleware),
});
