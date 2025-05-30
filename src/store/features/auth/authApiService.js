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
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
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
        url: '/user/edit',
        method: 'PATCH',
        body: data,
      }),
      providesTags: ['userInfo'],
    }),
  }),
});

export const {
  useAuthLoginMutation,
  useAuthRegisterMutation,
  useAuthUserInfoQuery,
  useAuthLogOutMutation,
  useUpdateUserDataMutation,
} = authApi;
