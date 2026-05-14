import { baseApi } from '@/store/baseApi/baseApi';

const websiteFaqApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1️ Create Website FAQ
    createWebsiteFaq: builder.mutation({
      query: (data) => ({
        url: '/website-faq/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'website-faq-list', id: 'LIST' },
        { type: 'website-faq-public', id: 'LIST' },
      ],
    }),

    // 2️ Get All Website FAQs (with pagination + search + category filter + websiteType filter)
    getAllWebsiteFaqs: builder.query({
      query: ({
        search = '',
        category = '',
        websiteType = '',
        page = 1,
        limit = 10,
        isActive,
      }) => ({
        url: '/website-faq/list',
        method: 'GET',
        params: { search, category, websiteType, page, limit, isActive },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'website-faq',
                id: _id,
              })),
              { type: 'website-faq-list', id: 'LIST' },
            ]
          : [{ type: 'website-faq-list', id: 'LIST' }],
    }),

    // 3️ Get Public FAQs (for clients/lawyers)
    getPublicWebsiteFaqs: builder.query({
      query: ({ search = '', category = '', page = 1, limit = 10 }) => ({
        url: '/website-faq/public',
        method: 'GET',
        params: { search, category, page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'website-faq-public',
                id: _id,
              })),
              { type: 'website-faq-public', id: 'LIST' },
            ]
          : [{ type: 'website-faq-public', id: 'LIST' }],
    }),

    // 4️ Get FAQ by ID
    getSingleWebsiteFaq: builder.query({
      query: (id) => ({
        url: `/website-faq/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'website-faq', id }],
    }),

    // 5️ Update FAQ
    updateWebsiteFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/website-faq/${id}/update`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'website-faq', id },
        { type: 'website-faq-list', id: 'LIST' },
        { type: 'website-faq-public', id: 'LIST' },
      ],
    }),

    // 6️ Delete FAQ
    deleteWebsiteFaq: builder.mutation({
      query: (id) => ({
        url: `/website-faq/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'website-faq', id },
        { type: 'website-faq-list', id: 'LIST' },
        { type: 'website-faq-public', id: 'LIST' },
      ],
    }),

    // 7️ Toggle Active Status
    toggleWebsiteFaqStatus: builder.mutation({
      query: (id) => ({
        url: `/website-faq/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'website-faq', id },
        { type: 'website-faq-list', id: 'LIST' },
        { type: 'website-faq-public', id: 'LIST' },
      ],
    }),

    // 8️ Bulk Update Order
    bulkUpdateWebsiteFaqOrder: builder.mutation({
      query: (updates) => ({
        url: '/website-faq/bulk-order',
        method: 'POST',
        body: { updates },
      }),
      invalidatesTags: [{ type: 'website-faq-list', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateWebsiteFaqMutation,
  useGetAllWebsiteFaqsQuery,
  useGetPublicWebsiteFaqsQuery,
  useGetSingleWebsiteFaqQuery,
  useUpdateWebsiteFaqMutation,
  useDeleteWebsiteFaqMutation,
  useToggleWebsiteFaqStatusMutation,
  useBulkUpdateWebsiteFaqOrderMutation,
} = websiteFaqApiService;
