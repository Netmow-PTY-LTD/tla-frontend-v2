import { configureStore } from '@reduxjs/toolkit';
import { servicesApiService } from './api/super-admin/servicesApiService';
import { publicApiService } from '@/store/api/public/publicApiService';
import { authApiService } from './api/public/authApiService';
import authSlice from './StateSlice/auth/authSlice';

export const store = configureStore({
  reducer: {
    authReducer: authSlice,
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
