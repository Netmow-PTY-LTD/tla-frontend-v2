import { baseApi } from '@/store/baseApi/baseApi';

const contactApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
    }),
    getContactInfo: builder.query({
      query: () => ({
        url: '/contact/contact-info',
        method: 'GET',
      }),
      providesTags: ['contact-info'],
    }),
  }),
});

export const {
  useSendContactMessageMutation,
  useGetContactInfoQuery
} = contactApiService;
