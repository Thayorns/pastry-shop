import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

export type InitialState = {
  isAuthenticated: boolean;
  login: string | null;
  loginStatus: string;
  role: boolean;
}
export interface UserLoginPayload {
  login: string;
  role: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  
  initialState: {
    isAuthenticated: false,
    login: null,
    loginStatus: 'idle',
    role: false,
  } as InitialState,

  reducers: {
    logout(state: InitialState) {
      state.isAuthenticated = false;
      state.login = null;
      state.loginStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
    .addMatcher(apiSlice.endpoints.logInUser.matchPending, (state: InitialState) => {
      state.loginStatus = 'loading';
    })
    .addMatcher(apiSlice.endpoints.logInUser.matchFulfilled, (state: InitialState, action: any) => {
      state.loginStatus = 'succeeded';
      state.isAuthenticated = true;
      const {login, role} = action.payload as UserLoginPayload;
      state.login = login;
      state.role = role;
    })
    .addMatcher(apiSlice.endpoints.logInUser.matchRejected, (state: InitialState) => {
      state.loginStatus = 'failed';
    });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
