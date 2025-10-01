import { baseApi } from '../../baseApi/baseApi';

const lawFirmCertificationApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addLawFirmCertification: builder.mutation({
      query: (body) => ({
        url: '/lawfirm-certification/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['lawfirm-certification'],
    }),
    allLawFirmCertifications: builder.query({
      query: ({ countryId, type, search, page, limit }) => ({
        url: '/lawfirm-certification/list',
        method: 'GET',
        params: { countryId, type, search, page, limit },
      }),
      providesTags: ['lawfirm-certification'],
    }),
    getLawFirmCertificationById: builder.query({
      query: (id) => ({
        url: `/lawfirm-certification/${id}`,
        method: 'GET',
      }),
      providesTags: ['lawfirm-certification'],
    }),
    updateLawFirmCertification: builder.mutation({
      query: ({ certificationId, body }) => ({
        url: `/lawfirm-certification/${certificationId}/update`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['lawfirm-certification'],
    }),
    deleteLawFirmCertification: builder.mutation({
      query: (certificationId) => ({
        url: `/lawfirm-certification/${certificationId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['lawfirm-certification'],
    }),
  }),
});

export const {
  useAddLawFirmCertificationMutation,
  useAllLawFirmCertificationsQuery,
  useGetLawFirmCertificationByIdQuery,
  useUpdateLawFirmCertificationMutation,
  useDeleteLawFirmCertificationMutation,
} = lawFirmCertificationApiService;
