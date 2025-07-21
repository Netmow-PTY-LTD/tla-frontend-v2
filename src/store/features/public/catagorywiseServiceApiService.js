import { baseApi } from '../../baseApi/baseApi';

const categoryWiseApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: '/category/public',
        method: 'GET',
      }),
      providesTags: ['category'],
    }),
  }),
});

export const { useGetAllCategoriesQuery } = categoryWiseApiService;
