import { baseApi } from '../../baseApi/baseApi';

const firmsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFirms: builder.query({
      query: (params) => ({
        url: `/firms/list`,
        method: 'GET',
        params,
      }),
      providesTags: ['firms'],
    }),
    getSingFirmDetails: builder.query({
      query: (firmId) => ({
        url: `/firms/${firmId}`,
        method: 'GET',
      }),
      providesTags: ['firms'],
    }),
    updateFirmStatus: builder.mutation({
      query: (body) => ({
        url: `/firms/${body.firmId}/status`,
        method: 'PATCH',
        body: body.data,
      }),
      invalidatesTags: ['firms'],
    }),
  }),
});

export const {
  useGetAllFirmsQuery,
  useUpdateFirmStatusMutation,
  useGetSingFirmDetailsQuery,
} = firmsApiService;
