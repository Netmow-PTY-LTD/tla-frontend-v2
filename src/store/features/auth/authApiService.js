import { baseApi } from '@/store/baseApi/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    authLogin: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),

    authRegister: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useAuthLoginMutation, useAuthRegisterMutation } = authApi;
