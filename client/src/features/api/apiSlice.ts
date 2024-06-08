import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
interface AddUserRequest {
  email: string;
  login: string;
  password: string;
}
interface LogInUserRequest {
  login: string;
  password: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001'}),
  endpoints: (builder: any) => ({
    
    // получение QR-кода
    getQRcode: builder.query({
      query: () => `/qr`
    }),

    // добавление нового юзера
    addUser: builder.mutation({ 
      query: (body: AddUserRequest) => ({
        url: `/api/register`,
        method: 'POST',
        body,
      })
    }),

    // получение токена юзером
    getToken: builder.query({
      query: (token: string) => `http://localhost:3001/api/activate/${token}`
    }),
    
    // вход в аккаунт юзером
    logInUser: builder.mutation({
      query: (body: LogInUserRequest) => ({
        url: `/api/login`,
        method: 'POST',
        body,
      })
    }),
    
    // выход из аккаунта юзером
    userLogout: builder.mutation({
      query: () => ({
        url: `/api/logout`,
        method: 'POST'
      }),
    })
    

  }),
})
export const {useAddUserMutation, useGetTokenQuery, useLogInUserMutation, useUserLogoutMutation, useGetQRcodeQuery} = apiSlice;
