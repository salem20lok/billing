import { TeamsState } from "./type";
import { createSlice } from "@reduxjs/toolkit";
import { fetchTeams } from "./action";

export const initialState: TeamsState = {
  error: false,
  loading: false,
  teams: [],
  count: 0,
};

const TeamsSlice = createSlice({
  name: "teams",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTeams.rejected, (state) => {
      state.error = true;
      state.loading = false;
      state.teams = [];
      state.count = 0;
    });
    builder.addCase(fetchTeams.pending, (state) => {
      state.error = false;
      state.loading = true;
      state.teams = [];
      state.count = 0;
    });
    builder.addCase(fetchTeams.fulfilled, (state, { payload }) => {
      state.error = false;
      state.loading = false;
      state.teams = payload.teams;
      state.count = payload.count;
    });
  },
});

export default TeamsSlice.reducer;
