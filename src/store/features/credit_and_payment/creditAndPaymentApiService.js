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
    removePaymentMethod: builder.mutation({
      query: (PaymentMethodId) => ({
        url: `/settings/credit-payment/payment-method/${PaymentMethodId}`,
        method: 'DELETE',
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

    addCreditPackage: builder.mutation({
      query: (body) => ({
        url: '/settings/credit-payment/packages/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['credit-payment'],
    }),

    getAllCreditPackages: builder.query({
      query: () => ({
        url: '/settings/credit-payment/packages/list',
        method: 'GET',
      }),
      providesTags: ['credit-payment'],
    }),

    updateCreditPackage: builder.mutation({
      query: (body) => ({
        url: `/settings/credit-payment/packages/edit/${body?._id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['credit-payment'],
    }),
    purchaseCreditPackage: builder.mutation({
      query: (body) => ({
        url: `/settings/credit-payment/purchase`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['credit-payment', 'transaction-history', 'next-offer'],
    }),

    // transaction
    transactionHistory: builder.query({
      query: () => ({
        url: '/settings/credit-payment/transactions',
        method: 'GET',
      }),
      providesTags: ['transaction-history'],
    }),

    transactionHistory: builder.query({
      query: () => ({
        url: '/settings/credit-payment/transaction/list',
        method: 'GET',
      }),
      providesTags: ['transaction-history'],
    }),

    spendCredit: builder.mutation({
      query: (body) => ({
        url: `/settings/credit-payment/spendCredits`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['user-credit-stats'],
    }),

    getNextOffer: builder.query({
      query: (body) => ({
        url: `/settings/credit-payment/next-offer`,
        method: 'GET',
        body,
      }),
      providesTags: ['next-offer'],
    }),
    getUserCreditStats: builder.query({
      query: (body) => ({
        url: `/settings/credit-payment/user-credit-stats`,
        method: 'GET',
        body,
      }),
      providesTags: ['user-credit-stats'],
    }),
  }),

  // credit transaction / spend credit
});

export const {
  useUpdateBillingDetailsMutation,
  useGetBillingsDetailsQuery,
  useAddPaymentMethodMutation,
  useSetupPaymentIntentMutation,
  useGetPaymentMethodQuery,
  useAddCreditPackageMutation,
  useGetAllCreditPackagesQuery,
  useUpdateCreditPackageMutation,
  usePurchaseCreditPackageMutation,
  useTransactionHistoryQuery,
  useRemovePaymentMethodMutation,
  useGetNextOfferQuery,
  useGetUserCreditStatsQuery,
  useSpendCreditMutation,
} = creditAndPaymentApiService;
