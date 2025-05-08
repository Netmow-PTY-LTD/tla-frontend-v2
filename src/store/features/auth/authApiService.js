import { baseApi } from '@/store/baseApi/baseApi';
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import Cookies from 'js-cookie';

// export const authApiService = createApi({
//   reducerPath: 'authApiService',
//   baseQuery: fetchBaseQuery({
//     baseUrl:
//       `${process.env.NEXT_PUBLIC_BASE_URL_PROD}` +
//       `${process.env.NEXT_PUBLIC_API_VERSION_PROD}` +
//       '/auth',
//     prepareHeaders: (headers) => {
//       const token = Cookies.get('token');
//       if (token) {
//         headers.set('authorization', token);
//       }
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     authLogin: builder.mutation({
//       query: (body) => ({
//         url: '/login',
//         method: 'POST',
//         body,
//       }),
//     }),
//     authRegister: builder.mutation({
//       query: (body) => ({
//         url: '/register',
//         method: 'POST',
//         body,
//       }),
//     }),
//   }),
// });

// export const { useAuthLoginMutation, useAuthRegisterMutation } = authApiService;

//   injectEndpoint route ==>

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
