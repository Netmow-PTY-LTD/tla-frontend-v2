import { baseApi } from '../../baseApi/baseApi';

const leadServiceApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addLeadService: builder.mutation({
      query: (body) => ({
        url: '/lead-service/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['leadService'],
    }),
    getLeadServiceList: builder.query({
      query: () => ({
        url: `lead-service/list`,
        method: 'GET',
      }),
      invalidatesTags: ['leadService'],
    }),

    deleteLeadService: builder.mutation({
      query: (id) => ({
        url: `/lead-service/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['leadService'],
    }),
  }),
});

export const {
  useAddLeadServiceMutation,
  useGetLeadServiceListQuery,
  useDeleteLeadServiceMutation,
} = leadServiceApiService;
