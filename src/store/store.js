import { configureStore } from '@reduxjs/toolkit';
import { servicesApiService } from './baseApi/super-admin/servicesApiService';
import { publicApiService } from '@/store/baseApi/public/publicApiService';
// import { authApiService } from './features/auth/authApiService';
import authSlice from './features/auth/authSlice';
import { baseApi } from './baseApi/baseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice,
    [servicesApiService.reducerPath]: servicesApiService.reducer,
    // [authApiService.reducerPath]: authApiService.reducer,
    [publicApiService.reducerPath]: publicApiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // .concat(authApiService.middleware)
      .concat(servicesApiService.middleware)
      .concat(publicApiService.middleware)
      .concat(baseApi.middleware),
});
