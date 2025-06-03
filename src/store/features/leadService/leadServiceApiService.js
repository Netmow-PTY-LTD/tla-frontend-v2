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
      providesTags: ['leadService'],
    }),

    deleteLeadService: builder.mutation({
      query: (leadServiceId) => ({
        url: `/lead-service/delete/${leadServiceId}`,
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
