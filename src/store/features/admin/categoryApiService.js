import { baseApi } from '../../baseApi/baseApi';

const categoryApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (body) => ({
        url: '/category/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['category'],
    }),
    allCategories: builder.query({
      query: () => ({
        url: '/category/list',
        method: 'GET',
      }),
      providesTags: ['category'],
    }),
    getCategoryById: builder.query({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'GET',
      }),
      providesTags: ['category'],
    }),
    editCategory: builder.mutation({
      query: (payload) => ({
        url: `/category/edit/${payload?.id}`,
        method: 'PATCH',
        body: payload.data,
      }),
      invalidatesTags: ['category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['category'],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiService;
