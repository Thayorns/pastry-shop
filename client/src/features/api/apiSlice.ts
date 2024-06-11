import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {FetchArgs, FetchBaseQueryError, BaseQueryFn} from '@reduxjs/toolkit/query';
import { RootState } from '../../app/store/store';
import { setToken, logout } from './authSlice';
interface AddUserRequest {
  email: string;
  login: string;
  password: string;
}
interface LogInUserRequest {
  login: string;
  password: string;
}

interface AddQRCodeRequest {
  login: string;
}
interface RefreshTokenResponse {
  accessToken: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args:any, api:any, extraOptions:any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery('/api/refresh-token', api, extraOptions);

    if (refreshResult.data) {
      const refreshData = refreshResult.data as RefreshTokenResponse;
      // Store the new token
      api.dispatch(setToken( { accessToken: refreshData.accessToken } ));
      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Logout user if refresh fails
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder: any) => ({

    // добавление QR-кода
    addQRcode: builder.mutation({
      query: (body: AddQRCodeRequest) => ({
        url: `/qr`,
        method: 'POST',
        body,
      })
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
export const {useAddUserMutation, useGetTokenQuery, useLogInUserMutation, useUserLogoutMutation, useAddQRcodeMutation } = apiSlice;
