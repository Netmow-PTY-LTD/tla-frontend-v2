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
    editLawyerUser: builder.mutation({
      query: (body) => ({
        url: `/marketing/edit-lawyer/${body.userId}`,
        method: "PATCH",
        body:body.data,
      }),
      invalidatesTags: [
        "marketing",
        "leadService",
        "lead",
        "lead-list",
        "userInfo",
      ],
    }),
    getLawyerUserById:builder.query({
      query:(id)=>{
        return{
          url:`/marketing/lawyer/${id}`,
          method:"GET",
        }
      }
    }),

    deleteLayer:builder.mutation({
      query:(id)=>{
        return{
          url:`/marketing/lawyer/${id}`,
          method:"DELETE",
        }
      },
      invalidatesTags: [
        "marketing",
        "leadService",
        "lead",
        "lead-list",
        "userInfo",
      ],
    })
  }),

  
});

export const { 
 useCreateLawyerUserMutation,
 useEditLawyerUserMutation,
 useGetLawyerUserByIdQuery,
 useDeleteLayerMutation,
 
} = marketingApi;
