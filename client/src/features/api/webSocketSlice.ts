import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
    connected: boolean;
    messages: any[];
};

const webSocketSlice = createSlice({
    name: 'webSocket',

    initialState: {
      connected: false,
      messages: [],
    } as InitialState,

    reducers: {
      webSocketConnected(state) {
        state.connected = true;
      },
      webSocketDisconnected(state) {
        state.connected = false;
      },
      webSocketMessageReceived(state, action) {
        state.messages.push(action.payload);
      },
    },
  });
  
  export const {
    webSocketConnected,
    webSocketDisconnected,
    webSocketMessageReceived,
  } = webSocketSlice.actions;
  
  export default webSocketSlice.reducer;