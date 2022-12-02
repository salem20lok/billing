import { UsersState } from "./Type";
import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "./action";

export const initialState: UsersState = {
  error: false,
  loading: false,
  users: [],
  count: 0,
};

const UsersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.rejected, (state) => {
      state.error = true;
      state.loading = false;
      state.users = [];
      state.count = 0;
    });
    builder.addCase(fetchUsers.pending, (state) => {
      state.error = false;
      state.loading = true;
      state.users = [];
      state.count = 0;
    });
    builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
      state.error = false;
      state.loading = false;
      state.users = payload.users;
      state.count = payload.count;
    });
  },
});

export default UsersSlice.reducer;
