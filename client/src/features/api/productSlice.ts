import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

type ProductPayload = {
    photo: string,
    title: string,
    price: number,
};

type IncreasedPayload = {
    title: string;
};

type DeletePayload = {
    title: string;
};

type InitialState = {
    productArray: ProductPayload[];
    counts: Record<string, number>;
};

const productSlice = createSlice({
    name: 'product',

    initialState: {
        productArray: [],
        counts: {},
    } as InitialState,

    reducers: {
        // редюсер для "дом"
        buyCake(state, action) {
            const cake = action.payload as ProductPayload;
            const isDuplicate = state.productArray.find(el => el.title === cake.title);
            if (!isDuplicate) {
                state.productArray.push(cake);
                state.counts[cake.title] = 1;
            }
        },
        // удалить из корзины
        deleteCake(state, action) {
            const { title } = action.payload as DeletePayload;
            state.productArray = state.productArray.filter((el) => el.title !== title);
            delete state.counts[title];
        },
        // очистить весь слайс
        dropCakes(state) {
            state.productArray = [];
            state.counts = {};
        },
        // прибавить 1 торт
        increaseCount(state, action) {
            const { title } = action.payload as IncreasedPayload;
            if (state.counts[title] !== undefined) state.counts[title] += 1;
        },
        // убрать 1 торт
        decreaseCount(state, action) {
            const { title } = action.payload as IncreasedPayload;
            if(state.counts[title] > 1 && state.counts[title] !== undefined) state.counts[title] -= 1;
        }
    },

    extraReducers: (builder) => {
    }
});

export const { buyCake, deleteCake, dropCakes, increaseCount, decreaseCount } = productSlice.actions;
export default productSlice.reducer;
