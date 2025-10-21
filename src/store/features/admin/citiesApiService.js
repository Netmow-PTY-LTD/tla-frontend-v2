import { baseApi } from '../../baseApi/baseApi';

const citiesApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCity: builder.mutation({
      query: (body) => ({
        url: '/country/city/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['city'],
    }),
    getAllCities: builder.query({
      query: (params) => ({
        url: '/country/city/list',
        method: 'GET',
        params,
      }),
      providesTags: ['city'],
    }),
  }),
});

export const { useAddCityMutation, useGetAllCitiesQuery } = citiesApiService;
