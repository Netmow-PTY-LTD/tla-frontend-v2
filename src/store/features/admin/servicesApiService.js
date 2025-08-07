import { baseApi } from '../../baseApi/baseApi';

const servicesApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (body) => ({
        url: '/service/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['service','service-list'],
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
      providesTags: ['service-list'],
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
      invalidatesTags: ['service','service-list'],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['service','service-list'],
    }),
    addCountryWiseService: builder.mutation({
      query: (body) => ({
        url: '/country-wise-map/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['country-wise-map','country-wise-map-list'],
    }),
    editCountryWiseService: builder.mutation({
      query: (body) => ({
        url: `/country-wise-map/edit/${body.countryId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['country-wise-map','country-wise-map-list'],
    }),
    getAllCountryWiseServices: builder.query({
      query: () => ({
        url: '/country-wise-map/list',
        method: 'GET',
      }),
      providesTags: ['country-wise-map-list'],
    }),
    getCountryWiseServices: builder.query({
      query: (id) => ({
        url: `/country-wise-map/country/${id}?type=servicelist`,
        method: 'GET',
      }),
      providesTags: ['country-wise-map'],
    }),
    manageService: builder.mutation({
      query: (body) => ({
        url: '/country-wise-map/manage-service',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['country-wise-map','country-wise-map-list'],
    }),
    getAllManagedServices: builder.query({
      query: ({ countryId, serviceId }) => ({
        url: `/country-wise-map/manage-service?countryId=${countryId}&serviceId=${serviceId}`,
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
  useEditCountryWiseServiceMutation,
  useGetAllCountryWiseServicesQuery,
  useGetCountryWiseServicesQuery,
  useManageServiceMutation,
  useGetAllManagedServicesQuery,
} = servicesApiService;
