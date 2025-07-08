import { baseApi } from '../../baseApi/baseApi';

const leadServiceApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addLeadService: builder.mutation({
      query: (body) => ({
        url: '/settings/lead-service/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['leadService','lead'],
    }),
    getLeadServiceList: builder.query({
      query: () => ({
        url: `/settings/lead-service/list`,
        method: 'GET',
      }),
      providesTags: ['leadService'],
    }),

    deleteLeadService: builder.mutation({
      query: (leadServiceId) => ({
        url: `/settings/lead-service/delete/${leadServiceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['leadService','lead'],
    }),
    leadServiceSelectedOptionsUpdate: builder.mutation({
      query: ({ leadServiceId, answers }) => {
        return {
          url: `/settings/lead-service/${leadServiceId}/options`,
          method: 'PATCH',
          body: answers,
        };
      },
      invalidatesTags: ['leadService'],
    }),
    leadServiceLocationUpdate: builder.mutation({
      query: (body) => {
        return {
          url: `/settings/lead-service/locations`,
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
