import { baseApi } from '../../baseApi/baseApi';

const seoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHeaderFooterCodes: builder.query({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: '/seo/header-footer-codes',
        method: 'GET',
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ['seo'],
    }),
    getHeaderFooterCodeById: builder.query({
      query: (id) => ({
        url: `/seo/header-footer-codes/${id}`,
        method: 'GET',
      }),
      providesTags: ['seo'],
    }),
    createHeaderFooterCode: builder.mutation({
      query: (data) => ({
        url: '/seo/header-footer-codes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['seo'],
    }),
    updateHeaderFooterCode: builder.mutation({
      query: ({ id, data }) => ({
        url: `/seo/header-footer-codes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['seo'],
    }),
    deleteHeaderFooterCode: builder.mutation({
      query: (id) => ({
        url: `/seo/header-footer-codes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['seo'],
    }),
  }),
});

export const {
  useGetHeaderFooterCodesQuery,
  useGetHeaderFooterCodeByIdQuery,
  useCreateHeaderFooterCodeMutation,
  useUpdateHeaderFooterCodeMutation,
  useDeleteHeaderFooterCodeMutation,
} = seoApi;