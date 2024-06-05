import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    login: null,
    loginStatus: 'idle',
    error: null,
  },
  reducers: {
    logout(state: any) {
      state.isAuthenticated = false;
      state.login = null;
      state.loginStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(apiSlice.endpoints.logInUser.matchPending, (state: any) => {
        state.loginStatus = 'loading';
        state.error = null;
      })
      .addMatcher(apiSlice.endpoints.logInUser.matchFulfilled, (state: any, action: any) => {
        state.loginStatus = 'succeeded';
        state.isAuthenticated = true;
        state.login = action.payload.login;
      })
      .addMatcher(apiSlice.endpoints.logInUser.matchRejected, (state: any, action: any) => {
        state.loginStatus = 'failed';
        state.error = action.error;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
