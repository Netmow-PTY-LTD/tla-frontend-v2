import { baseApi } from '../../baseApi/baseApi';

const creditAndPaymentApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateBillingDetails: builder.mutation({
      query: (body) => ({
        url: '/settings/credit-payment/billing',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['credit-payment'],
    }),
    setupPaymentIntent: builder.mutation({
      query: (data) => {
        return {
          url: '/settings/credit-payment/setup-intent',
          method: 'POST',
          // body: data,
        };
      },
    }),
    addPaymentMethod: builder.mutation({
      query: (body) => ({
        url: '/settings/credit-payment/payment-method',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['payment-method'],
    }),
    getPaymentMethod: builder.query({
      query: () => ({
        url: '/settings/credit-payment/payment-method',
        method: 'GET',
      }),
      providesTags: ['payment-method'],
    }),
    getBillingsDetails: builder.query({
      query: () => ({
        url: `/settings/credit-payment/billing`,
        method: 'GET',
      }),
      providesTags: ['credit-payment'],
    }),
  }),
});

export const {
  useUpdateBillingDetailsMutation,
  useGetBillingsDetailsQuery,
  useAddPaymentMethodMutation,
  useSetupPaymentIntentMutation,
  useGetPaymentMethodQuery,
} = creditAndPaymentApiService;
