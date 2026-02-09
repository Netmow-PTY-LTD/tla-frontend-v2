import { baseApi } from '../../baseApi/baseApi';

const categoryWiseApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: (countryId) => {
        if (countryId) {
          return {
            url: '/category/public',
            method: 'GET',
            params: countryId,
          };
        }
        return {
          url: '/category/public',
          method: 'GET',
        };
      },
      providesTags: ['public-category'],
    }),
  }),
});

export const { useGetAllCategoriesQuery } = categoryWiseApiService;
