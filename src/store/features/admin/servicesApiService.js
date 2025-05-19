import { baseApi } from '../../baseApi/baseApi';

const servicesApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (body) => ({
        url: '/service/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['service'],
      // onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
      //   try {
      //     await queryFulfilled;

      //     dispatch(servicesApiService.endpoints.allServices.initiate());
      //   } catch (error) {
      //     console.error('Failed to add service:', error);
      //   }
      // },
    }),
    allServices: builder.query({
      query: () => ({
        url: '/service/list',
        method: 'GET',
      }),
      providesTags: ['service'],
    }),
    singleService: builder.query({
      query: (id) => ({
        url: `/service/${id}`,
        method: 'GET',
      }),
      providesTags: ['service'],
    }),
    editService: builder.mutation({
      query: (body) => ({
        url: `/service/edit/${body?.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['service'],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['service'],
    }),
     addCountryWiseService: builder.mutation({
      query: (body) => ({
        url: '/country-wise-map/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['service'],
    }),
     getAllCountryWiseServices: builder.query({
      query: () => ({
        url: '/country-wise-map/list',
        method: 'GET',
      }),
      providesTags: ['service'],
    }),
    getCountryWiseServices: builder.query({
      query: (id) => ({
        url: `/country-wise-map/country/${id}?type=servicelist`,
        method: 'GET',
      }),
      providesTags: ['service'],
    }),
  }),
});

export const {
  useAddServiceMutation,
  useAllServicesQuery,
  useSingleServiceQuery,
  useEditServiceMutation,
  useDeleteServiceMutation,
  useAddCountryWiseServiceMutation,
  useGetAllCountryWiseServicesQuery,
  useGetCountryWiseServicesQuery,
} = servicesApiService;
