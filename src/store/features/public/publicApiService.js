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
            singleZipCode: builder.query({
      query: (id) => ({
        url: `/country/zipcode/${id}`,
        method: 'GET',
      }),
      providesTags: ['Country'],
    }),
        ediZipCode: builder.mutation({
      query: (body) => ({
        url: `/country/zipcode/edit/${body.id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Country'],
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
   useEditZipCodeMutation
} = publicApiService;
