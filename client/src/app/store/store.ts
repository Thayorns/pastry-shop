import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../../features/api/apiSlice';
import authReducer from '../../features/api/authSlice';
import qrReducer from '../../features/api/qrSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        qr: qrReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
});

// экспортирую тип глобального состояния store
export type RootState = ReturnType<typeof store.getState>;

export default store;