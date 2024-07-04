import { createSlice } from '@reduxjs/toolkit';

type BasketIsClickedPayload = {
    title: string;
}

type InitialState = {
    top: number | null;
    bottom: number | null;
    basketIsClicked: string[];
};

const buttonSlice = createSlice({

    name: 'button',

    initialState: {
        top: null,
        bottom: null,
        basketIsClicked: [],
    } as InitialState,

    reducers: {
        setActiveTop(state: InitialState, action) {
            state.top = action.payload;
            state.bottom = null;
        },
        setActiveBottom(state: InitialState, action) {
            state.bottom = action.payload;
            state.top = null;
        },
        setBasketButtonIsClicked(state, action) {
            const { title } = action.payload as BasketIsClickedPayload;
            state.basketIsClicked = [...state.basketIsClicked, title];
        },
        clearBasketButton(state, action) {
            const { title } = action.payload as BasketIsClickedPayload;
            state.basketIsClicked = state.basketIsClicked.filter(el => el !== title);
        }
    },

    extraReducers: (builder) => {
    
    },
});
export const {setActiveTop, setActiveBottom, setBasketButtonIsClicked, clearBasketButton} = buttonSlice.actions;
export default buttonSlice.reducer;