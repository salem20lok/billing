import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveProfilePayload, UserState } from "./type";

export const initialState: UserState = {
  error: false,
  loading: false,
  user: {
    _id: "",
    firstName: "",
    email: "",
    role: "",
    lastName: "",
    avatar: "",
  },
  permission: [],
};

const UserSlice = createSlice({
  name: "User",
  initialState: initialState,
  reducers: {
    saveUser: (state, action: PayloadAction<saveProfilePayload>) => {
      state.error = false;
      state.loading = false;
      state.user = action.payload.user;
      state.permission = action.payload.permission;
    },
    removeUser: (state) => {
      state.error = false;
      state.loading = false;
      state.permission = [];
      state.user = {
        _id: "",
        firstName: "",
        email: "",
        role: "",
        lastName: "",
        avatar: "",
      };
    },
  },
});

export const { saveUser, removeUser } = UserSlice.actions;

export default UserSlice.reducer;
