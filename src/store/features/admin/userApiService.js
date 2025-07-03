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
      query: (formData) => ({
        url: `/user/edit/${formData.get('userId')}`,
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

    deleteCustomService: builder.mutation({
      query: (id) => ({
        url: `/user/service/delete/${id}`,
        method: 'DELETE',
      }),
    }),

    deleteAccreditation: builder.mutation({
      query: (id) => ({
        url: `/user/accreditation/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteProfileVideoUrl: builder.mutation({
      query: () => ({
        url: `/user/profile-media/delete/remove`,
        method: 'DELETE',
      }),
      invalidatesTags: ['userInfo'],
    }),
  }),
});

export const {
  useAllUsersQuery,
  useSingleUserQuery,
  useEditProfileMutation,
  useDeleteUserMutation,
  useDeleteCustomServiceMutation,
  useDeleteAccreditationMutation,
} = userApiService;
