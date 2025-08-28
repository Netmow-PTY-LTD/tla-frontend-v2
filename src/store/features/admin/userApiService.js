import { baseApi } from '../../baseApi/baseApi';

const userApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allUsers: builder.query({
      query: (params) => ({
        url: '/user/list',
        method: 'GET',
        params

      }),
      providesTags: ['all-users']
    }),
    singleUser: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'GET',
      }),
      providesTags: ['user']
    }),

    editProfile: builder.mutation({
      query: (formData) => ({
        url: `/user/edit/${formData.get('userId')}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['all-users', 'user']
    }),

    deleteUser: builder.mutation({
      query: (body) => ({
        url: `/user/delete/${body.get('userId')}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['all-users', 'user']
    }),

    deleteCustomService: builder.mutation({
      query: (id) => ({
        url: `/user/service/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['userInfo'],
    }),

    deleteAccreditation: builder.mutation({
      query: (id) => ({
        url: `/user/accreditation/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['userInfo'],
    }),
    deleteProfileVideoUrl: builder.mutation({
      query: (body) => ({
        url: `/user/profile-media/remove`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['userInfo'],
    }),


    //  -----------------------  client & lawyer specific api -----------------------



    allClientDetails: builder.query({
      query: (params) => ({
        url: '/admin/client/all',
        method: 'GET',
        params
      }),
      providesTags: ['all-client']
    }),

    allLawyerDetails: builder.query({
      query: (params) => ({
        url: '/admin/lawyer/all',
        method: 'GET',
        params
      }),
      providesTags: ['all-lawyer']
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
  useDeleteProfileVideoUrlMutation,
  useAllClientDetailsQuery,
  useAllLawyerDetailsQuery
} = userApiService;
