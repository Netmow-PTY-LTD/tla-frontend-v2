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
    authUserInfo: builder.query({
      query: () => ({
        url: '/users/userInfo',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useAuthLoginMutation,
  useAuthRegisterMutation,
  useAuthUserInfoQuery,
} = authApi;
