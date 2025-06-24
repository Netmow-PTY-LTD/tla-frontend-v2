import { baseApi } from '../../baseApi/baseApi';

const publicApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCountry: builder.mutation({
      query: (body) => ({
        url: '/country/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Country'],
    }),
    getCountryList: builder.query({
      query: () => ({
        url: `/country/list`,
        method: 'GET',
      }),
      providesTags: ['Country'],
    }),
    getSingleCountry: builder.query({
      query: (id) => ({
        url: `/country/${id}`,
        method: 'GET',
      }),
      providesTags: ['Country'],
    }),
    editCountry: builder.mutation({
      query: (body) => ({
        url: `/country/edit/${body?.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Country'],
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `/country/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Country'],
    }),
    // ----------- Zip code related ----------
    addZipCode: builder.mutation({
      query: (body) => ({
        url: '/country/zipcode/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Country'],
    }),
    getZipCodeList: builder.query({
      query: () => ({
        url: `/country/zipcode/list`,
        method: 'GET',
      }),
      providesTags: ['Country'],
    }),
    getSingleZipCode: builder.query({
      query: (id) => ({
        url: `/country/zipcode/${id}`,
        method: 'GET',
      }),
      providesTags: ['Country'],
    }),
    editZipCode: builder.mutation({
      query: (body) => ({
        url: `/country/zipcode/edit/${body._id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Country'],
    }),
    deleteZipCode: builder.mutation({
      query: (id) => ({
        url: `/country/zipcode/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Country'],
    }),
    //  ------------------ range related ------------------
    addRange: builder.mutation({
      query: (body) => ({
        url: '/country/zipcode/range/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['range'],
    }),
    getRangeList: builder.query({
      query: () => ({
        url: `/country/zipcode/range/list`,
        method: 'GET',
      }),
      providesTags: ['range'],
    }),
    getSingleRange: builder.query({
      query: (id) => ({
        url: `/country/zipcode/range/${id}`,
        method: 'GET',
      }),
      providesTags: ['range'],
    }),
    editRange: builder.mutation({
      query: (body) => ({
        url: `/country/zipcode/range/edit/${body._id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['range'],
    }),
    deleteRange: builder.mutation({
      query: (id) => ({
        url: `/country/zipcode/range/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['range'],
    }),

    //  ------------------ Profile related ------------------

    getUserList: builder.query({
      query: () => ({
        url: `/public/user/list`,
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/public/user/${id}`,
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
  }),
});

export const {
  useAddCountryMutation,
  useGetSingleCountryQuery,
  useEditCountryMutation,
  useGetCountryListQuery,
  useDeleteCountryMutation,
  useAddZipCodeMutation,
  useGetZipCodeListQuery,
  useGetSingleZipCodeQuery,
  useEditZipCodeMutation,
  useDeleteZipCodeMutation,
  useAddRangeMutation,
  useGetSingleRangeQuery,
  useGetRangeListQuery,
  useEditRangeMutation,
  useDeleteRangeMutation,
  useGetUserListQuery,
  useGetUserByIdQuery,
} = publicApiService;
