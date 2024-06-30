import { Middleware } from 'redux';
import { webSocketConnected, webSocketDisconnected, webSocketMessageReceived } from '../../features/api/webSocketSlice';

const webSocketMiddleware: Middleware = store => {
  let socket: WebSocket | null = null;

  return next => action => {
    if (webSocketConnected.match(action)) {
      const state = store.getState();
      const login = state.auth.login;
      socket = new WebSocket(`ws://localhost:3001?login=${login}`);

      socket.onopen = () => {
        store.dispatch(webSocketConnected());
      };

      socket.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        store.dispatch(webSocketMessageReceived(message));
      };

      socket.onclose = () => {
        store.dispatch(webSocketDisconnected());
      };

      socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
      };
    }

    if (webSocketDisconnected.match(action)) {
      if (socket) {
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };
};

export default webSocketMiddleware;