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
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
     
    }),
    resendVerificationEmail: builder.mutation({
      query: (data) => ({
        url: '/auth/resend-verification-email',
        method: 'POST',
        body: data,
      }),
     
    }),
    changeUserAccountStats: builder.mutation({
      query: (payload) => ({
        url: `/auth/users/${payload.userId}/status`,
        method: 'PATCH',
        body: payload.data,
      }),
     invalidatesTags:['all-users']
    }),
 sendOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: data,
      }),
     
    }),

 verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
     
    }),
 changeEmail: builder.mutation({
      query: (data) => ({
        url: '/auth/change-email',
        method: 'POST',
        body: data,
      }),
     
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
  useForgotPassowrdMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useChangeUserAccountStatsMutation,
  useChangeEmailMutation,
  useVerifyOtpMutation,
  useSendOtpMutation
} = authApi;
