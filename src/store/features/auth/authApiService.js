import { baseApi } from '@/store/baseApi/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    authLogin: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['userInfo'],
    }),

    authRegister: builder.mutation({
      query: (data) => ({
        url: '/auth/register/lawyer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['userInfo'],
    }),

    authClientRegister: builder.mutation({
      query: (data) => ({
        url: '/auth/register/client',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['userInfo'],
    }),
    authLogOut: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['userInfo'],
    }),
    authUserInfo: builder.query({
      query: () => ({
        url: '/user/userInfo',
        method: 'GET',
      }),
      providesTags: ['userInfo'],
    }),
    updateUserData: builder.mutation({
      query: (data) => ({
        url: '/user/update',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['userInfo'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['userInfo'],
    }),
    forgotPassowrd: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['userInfo'],
    }),
    resetPassowrd: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['userInfo'],
    }),
  }),
});

export const {
  useAuthLoginMutation,
  useAuthRegisterMutation,
  useAuthClientRegisterMutation,
  useAuthUserInfoQuery,
  useAuthLogOutMutation,
  useUpdateUserDataMutation,
  useChangePasswordMutation,
  useResetPassowrdMutation,
  useForgotPassowrdMutation
} = authApi;
