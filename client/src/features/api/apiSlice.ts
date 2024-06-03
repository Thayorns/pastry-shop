import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
interface AddUserRequest {
  email: string;
  login: string;
  password: string;
}
interface LogInUserRequest {
  login: string;
  password: string;
}

// // Тип для данных, получаемых в ответе
// interface AddUserResponse {
//   message: string;
//   user: {
//     id: number;
//     email: string;
//     login: string;
//     coffeeCount: number;
//     friend: boolean;
//     isActivated: boolean;
//   };
// }

// // Тип для ошибки
// interface ErrorResponse {
//   error: string;
// }

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
  endpoints: (builder: any) => ({
    
    addUser: builder.mutation({ 
      query: (body: AddUserRequest) => ({
        url: `/api/register`,
        method: 'POST',
        body,
      })
    }),
    
    logInUser: builder.mutation({
      query: (body: LogInUserRequest) => ({
        url: `/api/login`,
        method: 'POST',
        body,
      })
    }),
    
    userLogout: builder.mutation({
      query: () => `/api/logout`
    }),
    
    getToken: builder.query({
      query: (token: string) => `http://localhost:3001/api/activate/${token}`
    }),

  }),
})
export const {useAddUserMutation, useGetTokenQuery, useLogInUserMutation, useUserLogoutMutation} = apiSlice;
