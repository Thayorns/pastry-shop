import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

type InitialState = {
    number: number;
    qrCode: string;
    loadingStatus: string,
};

const qrSlice = createSlice({

    name: 'qr',

    initialState: {
        number: 0,
        qrCode: '',
        loadingStatus: 'idle',
    } as InitialState,

    reducers: {},

    extraReducers: (builder) => {
        builder
        .addMatcher(apiSlice.endpoints.addQRcode.matchPending, (state: InitialState) => {
            state.loadingStatus = 'loading';
          })
        .addMatcher(apiSlice.endpoints.addQRcode.matchFulfilled, (state: InitialState, action: any) => {
            state.loadingStatus = 'succeeded';
            const {number, qrCode} = action.payload;
            state.number = number;
            state.qrCode = qrCode;
        })
    },
});
export default qrSlice.reducer;