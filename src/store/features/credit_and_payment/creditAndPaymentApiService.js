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
      invalidatesTags: ['credit-payment'],
    }),
  }),
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
} = creditAndPaymentApiService;
