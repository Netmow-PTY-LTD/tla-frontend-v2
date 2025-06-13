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
        url: `/lead-service/list`,
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
    leadServiceSelectedOptionsUpdate: builder.mutation({
      query: ({ leadServiceId, answers }) => {
        return {
          url: `/lead-service/${leadServiceId}/options`,
          method: 'PATCH',
          body: answers,
        };
      },
      invalidatesTags: ['leadService'],
    }),
    leadServiceLocationUpdate: builder.mutation({
      query: (body) => {
        return {
          url: `/lead-service/locations`,
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: ['leadService'],
    }),
  }),
});

export const {
  useAddLeadServiceMutation,
  useGetLeadServiceListQuery,
  useDeleteLeadServiceMutation,
  useLeadServiceSelectedOptionsUpdateMutation,
  useLeadServiceLocationUpdateMutation,
} = leadServiceApiService;
