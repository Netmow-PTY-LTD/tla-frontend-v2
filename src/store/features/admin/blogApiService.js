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

    // Blog Category endpoints
    addBlogCategory: builder.mutation({
      query: (body) => ({
        url: '/blog-category/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BlogCategory', 'BlogCategory-list'],
    }),
    getBlogCategoryList: builder.query({
      query: (params) => ({
        url: `/blog-category/list`,
        method: 'GET',
        params
      }),
      providesTags: ['BlogCategory-list'],
    }),
    getSingleBlogCategory: builder.query({
      query: (id) => ({
        url: `/blog-category/${id}`,
        method: 'GET',
      }),
      providesTags: ['BlogCategory'],
    }),
    editBlogCategory: builder.mutation({
      query: (body) => ({
        url: `/blog-category/edit/${body?.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['BlogCategory', 'BlogCategory-list'],
    }),
    deleteBlogCategory: builder.mutation({
      query: (id) => ({
        url: `/blog-category/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BlogCategory', 'BlogCategory-list'],
    }),











  }),
});

export const {
  useAddCategoryMutation,
  useAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
  useAddBlogCategoryMutation,
  useGetBlogCategoryListQuery,
  useGetSingleBlogCategoryQuery,
  useEditBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogApiService;
