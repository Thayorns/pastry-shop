import { createSlice } from '@reduxjs/toolkit';

type DeletePayload = {
  title: string;
  name: string;
};

type WSPayload = {
  order: object;
};

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
        // console.log('WebSocket connected, state:', state);
      },
      webSocketDisconnected(state) {
        state.connected = false;
        // console.log('WebSocket disconnected, state:', state);
      },
      webSocketMessageReceived(state, action) {
        const { order } = action.payload as WSPayload;
        state.messages.push(order);
        console.log('Message received, state:', state);
      },
      cleanUpSocketState(state, action) {
        const { title, name } = action.payload as DeletePayload;
        state.messages = state.messages.filter(message => message.title !== title && message.name !== name);
      },
      deleteAllNotificationsOnRouteEnter(state) {
        state.messages = [];
      }
    },
  });
  
  export const {
    webSocketConnected,
    webSocketDisconnected,
    webSocketMessageReceived,
    cleanUpSocketState,
    deleteAllNotificationsOnRouteEnter
  } = webSocketSlice.actions;
  
  export default webSocketSlice.reducer;