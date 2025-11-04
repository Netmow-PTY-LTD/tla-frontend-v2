import { baseApi } from '../../baseApi/baseApi';

const seoMetaApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addMetaInfo: builder.mutation({
      query: (body) => ({
        url: '/seo/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['seo', 'meta'],
    }),
    getAllMetaInfo: builder.query({
      query: () => ({
        url: '/seo/list',
        method: 'GET',
      }),
      providesTags: ['seo', 'meta'],
    }),
    getSingleMetaInfo: builder.query({
      query: (seoId) => ({
        url: `/seo/${seoId}`,
        method: 'GET',
      }),
      providesTags: ['seo', 'meta'],
    }),
    editMetaInfo: builder.mutation({
      query: (body) => ({
        url: `/seo/${body?.seoId}/update`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['seo', 'meta'],
    }),
    deleteMetaInfo: builder.mutation({
      query: (seoId) => ({
        url: `/seo/${seoId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['seo', 'meta'],
    }),
  }),
});

export const {
  useAddMetaInfoMutation,
  useGetAllMetaInfoQuery,
  useGetSingleMetaInfoQuery,
  useEditMetaInfoMutation,
  useDeleteMetaInfoMutation,
} = seoMetaApiService;
