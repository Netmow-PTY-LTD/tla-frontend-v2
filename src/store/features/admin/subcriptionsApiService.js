import { baseApi } from '../../baseApi/baseApi';

const subscriptionsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSubscription: builder.mutation({
      query: (body) => ({
        url: '/subscriptions-packages/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['subscriptions-packages','subscriptions-package'],
    }),
    getAllSubscriptions: builder.query({
      query: (params) => ({
        url: '/subscriptions-packages/list',
        method: 'GET',
        params,
      }),
      providesTags: ['subscriptions-packages'],
    }),
    getSubscriptionById: builder.query({
      query: (subscriptionId) => ({
        url: `/subscriptions-packages/${subscriptionId}`,
        method: 'GET',
      }),
      providesTags: ['subscriptions-package'],
    }),
    updateSubscription: builder.mutation({
      query: ({ subscriptionId, body }) => ({
        url: `/subscriptions-packages/${subscriptionId}/update`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['subscriptions-packages','subscriptions-package'],
    }),
    deleteSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `/subscriptions-packages/${subscriptionId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['subscriptions-packages','subscriptions-package'],
    }),











  }),
});

export const {
  useAddSubscriptionMutation,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionsApiService;
