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
      invalidatesTags: ['website-faq', 'website-faq-list'],
    }),

    // 2️ Get All Website FAQs (with pagination + search + category filter + websiteType filter)
    getAllWebsiteFaqs: builder.query({
      query: ({ search = '', category = '', websiteType, page = 1, limit = 10, isActive }) => ({
        url: '/website-faq/list',
        method: 'GET',
        params: { search, category, websiteType, page, limit, isActive },
      }),
      providesTags: ['website-faq-list'],
    }),

    // 3️ Get Public FAQs (for clients/lawyers)
    getPublicWebsiteFaqs: builder.query({
      query: ({ search = '', category = '', page = 1, limit = 10 }) => ({
        url: '/website-faq/public',
        method: 'GET',
        params: { search, category, page, limit },
      }),
      providesTags: ['website-faq-public'],
    }),

    // 4️ Get FAQ by ID
    getSingleWebsiteFaq: builder.query({
      query: (id) => ({
        url: `/website-faq/${id}`,
        method: 'GET',
      }),
      providesTags: ['website-faq'],
    }),

    // 5️ Update FAQ
    updateWebsiteFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/website-faq/${id}/update`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['website-faq', 'website-faq-list', 'website-faq-public'],
    }),

    // 6️ Delete FAQ
    deleteWebsiteFaq: builder.mutation({
      query: (id) => ({
        url: `/website-faq/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['website-faq', 'website-faq-list', 'website-faq-public'],
    }),

    // 7️ Toggle Active Status
    toggleWebsiteFaqStatus: builder.mutation({
      query: (id) => ({
        url: `/website-faq/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: ['website-faq', 'website-faq-list', 'website-faq-public'],
    }),

    // 8️ Bulk Update Order
    bulkUpdateWebsiteFaqOrder: builder.mutation({
      query: (updates) => ({
        url: '/website-faq/bulk-order',
        method: 'POST',
        body: { updates },
      }),
      invalidatesTags: ['website-faq', 'website-faq-list', 'website-faq-public'],
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
