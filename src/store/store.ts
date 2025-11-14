import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/user"
import popupReducer from "./slices/popUp";
export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        // popup: popupReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
