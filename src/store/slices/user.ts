import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    value: string;
}

const initialState: UserState = {
    value: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
        resetUser: (state) => {
            state.value = "";
        }
    },
});

export const { setUser,resetUser } = userSlice.actions;
export default userSlice.reducer;
