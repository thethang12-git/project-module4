// store/popupSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PopupState {
    open: boolean;
    message: string;
}

const initialState: PopupState = {
    open: false,
    message: "",
};

const popupSlice = createSlice({
    name: "popup",
    initialState,
    reducers: {
        showPopup: (state, action: PayloadAction<string>) => {
            state.open = true;
            state.message = action.payload;
        },
        hidePopup: (state) => {
            state.open = false;
            state.message = "";
        },
    },
});

export const { showPopup, hidePopup } = popupSlice.actions;
export default popupSlice.reducer;
