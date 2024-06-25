import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
    top: number | null;
    bottom: number | null;
};

const buttonSlice = createSlice({

    name: 'button',

    initialState: {
        top: null,
        bottom: null,
    } as InitialState,

    reducers: {
        setActiveTop(state: InitialState, action) {
            state.top = action.payload;
            state.bottom = null;
        },
        setActiveBottom(state: InitialState, action) {
            state.bottom = action.payload;
            state.top = null;
        }
    },

    extraReducers: (builder) => {
    
    },
});
export const {setActiveTop, setActiveBottom} = buttonSlice.actions;
export default buttonSlice.reducer;