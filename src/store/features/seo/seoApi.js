import { baseApi } from '../../baseApi/baseApi';

const headerFooterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //  Get all header/footer codes
    getHeaderFooterCodes: builder.query({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: '/header-footer-codes/list',
        method: 'GET',
        params: { page, limit, search },
      }),
      providesTags: ['headerFooterCodes'],
    }),

    //  Get single header/footer code by ID
    getHeaderFooterCodeById: builder.query({
      query: (id) => ({
        url: `/header-footer-codes/${id}`,
        method: 'GET',
      }),
      providesTags: ['headerFooterCodes'],
    }),

    //  Create new header/footer code
    createHeaderFooterCode: builder.mutation({
      query: (data) => ({
        url: '/header-footer-codes/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['headerFooterCodes'],
    }),

    //  Update header/footer code
    updateHeaderFooterCode: builder.mutation({
      query: ({ id, data }) => ({
        url: `/header-footer-codes/${id}/update`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['headerFooterCodes'],
    }),

    //  Delete header/footer code
    deleteHeaderFooterCode: builder.mutation({
      query: (id) => ({
        url: `/header-footer-codes/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['headerFooterCodes'],
    }),

    //
    getPublicHeaderFooterCodes: builder.query({
      query: () => ({
        url: `/header-footer-codes/public/header-footer`,
        method: 'GET',
      }),
      providesTags: ['headerFooterCodes'],
    }),
  }),
});

export const {
  useGetHeaderFooterCodesQuery,
  useGetHeaderFooterCodeByIdQuery,
  useCreateHeaderFooterCodeMutation,
  useUpdateHeaderFooterCodeMutation,
  useDeleteHeaderFooterCodeMutation,
  useGetPublicHeaderFooterCodesQuery,
} = headerFooterApi;
