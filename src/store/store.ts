import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/user"
import popupReducer from "./slices/popUp";
import transactionsReducer from "./slices/transactions";
export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        transactions:transactionsReducer,
        // popup: popupReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
