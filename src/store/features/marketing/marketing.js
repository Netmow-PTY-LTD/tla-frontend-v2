import { baseApi } from "../../baseApi/baseApi";

const marketingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   createLawyerUser: builder.mutation({
      query: (body) => ({
        url: "/marketing/create-lawyer",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "marketing",
        "leadService",
        "lead",
        "lead-list",
        "userInfo",
      ],
    }),
  }),

  overrideExisting: false,
});

export const { 
 useCreateLawyerUserMutation
} = marketingApi;
