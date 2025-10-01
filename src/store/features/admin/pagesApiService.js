import { baseApi } from '../../baseApi/baseApi';

const pagesApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPage: builder.mutation({
      query: (body) => ({
        url: '/pages/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['pages'],
    }),
    getAllPages: builder.query({
      query: (params) => ({
        url: '/pages/list',
        method: 'GET',
        params,
      }),
      providesTags: ['pages'],
    }),
    getPageById: builder.query({
      query: (pageId) => ({
        url: `/pages/${pageId}`,
        method: 'GET',
      }),
      providesTags: ['pages'],
    }),
    updatePage: builder.mutation({
      query: ({ pageId, body }) => ({
        url: `/pages/${pageId}/update`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['pages'],
    }),
    deletePage: builder.mutation({
      query: (pageId) => ({
        url: `/pages/${pageId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['pages'],
    }),
  }),
});

export const {
  useAddPageMutation,
  useGetAllPagesQuery,
  useGetPageByIdQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pagesApiService;
