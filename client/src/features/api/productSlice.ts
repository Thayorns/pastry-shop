import { createSlice } from '@reduxjs/toolkit';

type ProductPayload = {
    photo: string,
    title: string,
    price: number,
};

type InitialState = {
    productArray: ProductPayload[];
};

const productSlice = createSlice({
    name: 'product',

    initialState: {
        productArray: [],
    } as InitialState,

    reducers: {
        buyCake(state, action) {
            const cake = action.payload;
            const isDuplicate = state.productArray.find(el => el.title === cake.title);
            if (!isDuplicate) {
                state.productArray.push(cake);
            }
        },
    },
});

export const { buyCake } = productSlice.actions;
export default productSlice.reducer;
