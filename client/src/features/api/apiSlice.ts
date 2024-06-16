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

interface CoffeeRequest {
  number: number;
  selectedCoffee: number;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001',
  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log('SENDING NEW ACCESS-TOKEN');
    
    try {
      const refreshResult = await baseQuery({
        url: `/api/refresh-token`,
        method: "POST",
        // credentials: 'include',
      }, api, extraOptions);
      
      if (refreshResult.data) {
        api.dispatch(setToken( { accessToken: refreshResult.data as string} ));
        result = await baseQuery(args, api, extraOptions);
        
      }else{
        api.dispatch(logout())
      }

    } catch(err) {
      console.error('Ошибка доступа', err)
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder: any) => ({

    // добавление кофе администратором
    addCoffee: builder.mutation({
      query: (body: CoffeeRequest) => ({
        url: `/api/admin-coffee`,
        method: 'POST',
        body,
      })
    }),

    // обновление кофе пользователем
    getCoffee: builder.query({
      query: (login: string) => `/api/user-coffee/${login}`,
    }),

    // генерация QR-кода пользователем и добавление в бд
    addQRcode: builder.mutation({
      query: (body: AddQRCodeRequest) => ({
        url: `/api/qr`,
        method: 'POST',
        body,
      }),
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
export const {useAddUserMutation,
  useGetTokenQuery,
  useLogInUserMutation,
  useUserLogoutMutation,
  useAddQRcodeMutation,
  useAddCoffeeMutation,
  useGetCoffeeQuery,
} = apiSlice;
