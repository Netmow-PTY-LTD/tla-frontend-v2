import { baseApi } from '../../baseApi/baseApi';

const userApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allUsers: builder.query({
      query: () => ({
        url: '/user/list',
        method: 'GET',
      }),
    }),
    singleUser: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'GET',
      }),
    }),
    editProfile: builder.mutation({
      query: (body) => ({
        url: `/user/edit/${body.get('service_id')}`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteUser: builder.mutation({
      query: (body) => ({
        url: `/user/delete/${body.get('service_id')}`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useAllUsersQuery,
  useSingleUserQuery,
  useEditProfileMutation,
  useDeleteUserMutation,
} = userApiService;
