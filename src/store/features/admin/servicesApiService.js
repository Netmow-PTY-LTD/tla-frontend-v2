import { baseApi } from '../../baseApi/baseApi';

const servicesApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (body) => ({
        url: '/service/add',
        method: 'POST',
        body,
      }),
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
    }),
    singleService: builder.query({
      query: (id) => ({
        url: `/service/${id}`,
        method: 'GET',
      }),
    }),
    editService: builder.mutation({
      query: (body) => ({
        url: `/service/edit/${body.get('service_id')}`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteService: builder.mutation({
      query: (body) => ({
        url: `/service/delete/${body.get('service_id')}`,
        method: 'PATCH',
        body,
      }),
    }),
    changeServicesStatus: builder.mutation({
      query: (body) => ({
        url: `/service/${body.id}/status`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useAddServiceMutation,
  useAllServicesQuery,
  useSingleServicesQuery,
  useEditServicesMutation,
  useChangeServicesStatusMutation,
} = servicesApiService;
