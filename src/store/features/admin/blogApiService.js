import { baseApi } from '../../baseApi/baseApi';

const blogApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (body) => ({
        url: '/blog/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['blog'],
    }),
    getAllBlogs: builder.query({
      query: (params) => ({
        url: '/blog/list',
        method: 'GET',
        params,
      }),
      providesTags: ['blog'],
    }),
    getSingleBlogById: builder.query({
      query: (blogId) => ({
        url: `/blog/${blogId}`,
        method: 'GET',
      }),
      providesTags: ['blog'],
    }),
    updateBlog: builder.mutation({
      query: (body) => ({
        url: `/blog/${body?.blogId}/update`,
        method: 'PUT',
        body: body.data,
      }),
      invalidatesTags: ['blog'],
    }),
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/blog/${blogId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['blog'],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = blogApiService;
