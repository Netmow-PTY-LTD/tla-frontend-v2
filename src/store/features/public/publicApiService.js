import { baseApi } from '../../baseApi/baseApi';

const publicApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCountry: builder.mutation({
      query: (body) => ({
        url: '/country/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Country', 'Country-list'],
    }),
    getCountryList: builder.query({
      query: () => ({
        url: `/country/list`,
        method: 'GET',
        params: {},
      }),
      providesTags: ['Country-list'],
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
      invalidatesTags: ['Country', 'Country-list'],
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `/country/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Country', 'Country-list'],
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
      query: (params) => ({
        url: `/country/zipcode/list`,
        method: 'GET',
        params,
      }),
      providesTags: ['zipcode-list'],
    }),
    getSingleZipCode: builder.query({
      query: (id) => ({
        url: `/country/zipcode/${id}`,
        method: 'GET',
      }),
      providesTags: ['zipcode'],
    }),
    editZipCode: builder.mutation({
      query: (body) => ({
        url: `/country/zipcode/edit/${body._id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['zipcode', 'zipcode-list'],
    }),
    deleteZipCode: builder.mutation({
      query: (id) => ({
        url: `/country/zipcode/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['zipcode', 'zipcode-list'],
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
      providesTags: ['range-list'],
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
      invalidatesTags: ['range', 'range-list'],
    }),
    deleteRange: builder.mutation({
      query: (id) => ({
        url: `/country/zipcode/range/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['range', 'range-list'],
    }),

    //  ------------------ Profile related ------------------

    getUserProfileList: builder.query({
      query: () => ({
        url: `/public/user/list`,
        method: 'GET',
      }),
      providesTags: ['public-user-list'],
    }),
    getUserProfileBySlug: builder.query({
      query: (slug) => ({
        url: `/public/user/by-slug/${slug}`,
        method: 'GET',
      }),
      providesTags: ['public-user'],
    }),
    getAllRequestsFromClient: builder.query({
      query: () => ({
        url: `/lead-requests`,
        method: 'GET',
      }),
      providesTags: ['requests'],
    }),
    getRequestFromClientById: builder.query({
      query: (id) => ({
        url: `/lead-request/${id}`,
        method: 'GET',
      }),
      providesTags: ['request'],
    }),

    createRating: builder.mutation({
      query: (body) => ({
        url: '/rating',
        method: 'POST',
        body,
      }),

      invalidatesTags: [
        'response',
        'response-list',
        'lead',
        'lead-my',
        'request',
      ],
    }),

    getCompanyList: builder.query({
      query: (params) => ({
        url: `/public/firm/list`,
        method: 'GET',
        params,
      }),
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
  useGetUserProfileListQuery,
  useGetUserProfileBySlugQuery,
  useGetAllRequestsFromClientQuery,
  useGetRequestFromClientByIdQuery,
  useCreateRatingMutation,
  useGetCompanyListQuery,
 
} = publicApiService;
