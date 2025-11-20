import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
    list: [],
};

export const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setTransactions: (state, action: PayloadAction<any[]>) => {
            state.list = action.payload;
        },
        resetTransactions: (state) => {
            state.list = [];
        }
    },
});

export const { setTransactions,resetTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
