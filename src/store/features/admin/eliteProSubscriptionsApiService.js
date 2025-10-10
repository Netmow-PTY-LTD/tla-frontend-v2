import { baseApi } from '../../baseApi/baseApi';

const eliteProSubscriptionsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addEliteProSubscription: builder.mutation({
      query: (body) => ({
        url: '/elite-pro-package/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['eliteProSubscriptions'],
    }),
    getAllEliteProSubscriptions: builder.query({
      query: (params) => ({
        url: '/elite-pro-package/list',
        method: 'GET',
        params,
      }),
      providesTags: ['eliteProSubscriptions'],
    }),
    getEliteProSubscriptionById: builder.query({
      query: (subscriptionId) => ({
        url: `/elite-pro-package/${subscriptionId}`,
        method: 'GET',
      }),
      providesTags: ['eliteProSubscriptions'],
    }),
    updateEliteProSubscription: builder.mutation({
      query: ({ subscriptionId, body }) => ({
        url: `/elite-pro-package/${subscriptionId}/update`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['eliteProSubscriptions'],
    }),
    deleteEliteProSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `/elite-pro-package/${subscriptionId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['eliteProSubscriptions'],
    }),
  }),
});

export const {
  useAddEliteProSubscriptionMutation,
  useGetAllEliteProSubscriptionsQuery,
  useGetEliteProSubscriptionByIdQuery,
  useUpdateEliteProSubscriptionMutation,
  useDeleteEliteProSubscriptionMutation,
} = eliteProSubscriptionsApiService;
