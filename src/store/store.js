import { configureStore } from '@reduxjs/toolkit';
import { servicesApiService } from './API/super-admin/servicesApiService';
import { publicApiService } from '@/store/API/public/publicApiService';
import { authApiService } from './API/public/authApiService';

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
