import { baseApi } from '../../baseApi/baseApi';

const categoryWiseApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: (countryId) => ({
        url: '/category/public',
        method: 'GET',
        params: countryId,
      }),
      providesTags: ['public-category'],
    }),
  }),
});

export const { useGetAllCategoriesQuery } = categoryWiseApiService;
