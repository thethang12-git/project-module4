import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    value: string;
    avatar:string | null;
}

const initialState: UserState = {
    value: "",
    avatar: ""
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
        },
        setAvatar: (state, action: PayloadAction<string>) => {
            state.avatar = action.payload;
        }
    },
});

export const { setUser,resetUser,setAvatar } = userSlice.actions;
export default userSlice.reducer;
