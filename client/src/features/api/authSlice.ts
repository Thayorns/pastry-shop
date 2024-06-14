import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

export type InitialState = {
  isAuthenticated: boolean;
  login: string | null;
  loginStatus: string;
  role: boolean;
  accessToken: string;
  coffee: number;
}
export interface UserLoginPayload {
  login: string;
  role: boolean;
  accessToken: string;
  coffee: number;
}

const authSlice = createSlice({
  name: 'auth',
  
  initialState: {
    accessToken: '',
    isAuthenticated: false,
    login: null,
    loginStatus: 'idle',
    role: false,
    coffee: 0,
  } as InitialState,

  reducers: {
    logout(state: InitialState) {
      state.isAuthenticated = false;
      state.login = null; 
      state.loginStatus = 'idle';
      state.accessToken = '';
      state.role = false;
      state.coffee = 0;
    },
    setToken(state: InitialState, action: { payload: { accessToken: string } }) {
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
    .addMatcher(apiSlice.endpoints.logInUser.matchPending, (state: InitialState) => {
      state.loginStatus = 'loading';
    })
    .addMatcher(apiSlice.endpoints.logInUser.matchFulfilled, (state: InitialState, action: any) => {
      state.loginStatus = 'succeeded';
      state.isAuthenticated = true;
      const {login, role, accessToken, coffee} = action.payload as UserLoginPayload;
      state.login = login;
      state.role = role;
      state.accessToken = accessToken;
      state.coffee = coffee;
    })
    .addMatcher(apiSlice.endpoints.logInUser.matchRejected, (state: InitialState) => {
      state.loginStatus = 'failed';
    });
  }
});

export const { logout, setToken } = authSlice.actions;

export default authSlice.reducer;
