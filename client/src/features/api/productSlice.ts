import { createSlice } from '@reduxjs/toolkit';

type ProductPayload = {
    photo: string,
    title: string,
    price: number,
};

type DeletePayload = {
    title: string;
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
        deleteCake(state, action) {
            const { title } = action.payload as DeletePayload;
            state.productArray = state.productArray.filter((el) => el.title !== title);
        },
        dropCakes(state) {
            state.productArray = [];
        }

    },
});

export const { buyCake, deleteCake, dropCakes } = productSlice.actions;
export default productSlice.reducer;
