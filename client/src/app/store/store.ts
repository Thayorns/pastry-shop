import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../../features/api/apiSlice';
import authReducer from '../../features/api/authSlice';
import qrReducer from '../../features/api/qrSlice';
import coffeeReducer from '../../features/api/coffeeSlice';
import buttonReducer from '../../features/api/buttonSlice';
import productReducer from '../../features/api/productSlice';
// import webSocketReducer from '../../features/api/webSocketSlice';
// import webSocketMiddleware from './webSocketMiddleware';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        qr: qrReducer,
        coffee: coffeeReducer,
        button: buttonReducer,
        product: productReducer,
        // webSocket: webSocketReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(
        apiSlice.middleware, 
        // webSocketMiddleware
    )
});

// экспортирую тип глобального состояния store
export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;