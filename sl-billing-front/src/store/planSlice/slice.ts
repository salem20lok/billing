import { PlansState } from "./type";
import { createSlice } from "@reduxjs/toolkit";
import { fetchPlans } from "./action";

export const initialState: PlansState = {
  error: false,
  loading: false,
  plans: [],
  count: 0,
};

const PlanSlice = createSlice({
  name: "plans",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPlans.rejected, (state) => {
      state.error = true;
      state.loading = false;
      state.plans = [];
      state.count = 0;
    });
    builder.addCase(fetchPlans.pending, (state) => {
      state.error = false;
      state.loading = true;
      state.plans = [];
      state.count = 0;
    });
    builder.addCase(fetchPlans.fulfilled, (state, { payload }) => {
      state.error = false;
      state.loading = false;
      state.plans = payload.plans;
      state.count = payload.count;
    });
  },
});

export default PlanSlice.reducer;
