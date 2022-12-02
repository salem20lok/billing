import { createSlice } from "@reduxjs/toolkit";
import { FeaturesState } from "./type";
import { fetchFeatures } from "./action";

export const initialState: FeaturesState = {
  error: false,
  loading: false,
  features: [],
  count: 0,
};

const FeatureSlice = createSlice({
  name: "features",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeatures.rejected, (state) => {
      state.error = true;
      state.loading = false;
      state.features = [];
      state.count = 0;
    });
    builder.addCase(fetchFeatures.pending, (state) => {
      state.error = false;
      state.loading = true;
      state.features = [];
      state.count = 0;
    });
    builder.addCase(fetchFeatures.fulfilled, (state, { payload }) => {
      state.error = false;
      state.loading = false;
      state.features = payload.features;
      state.count = payload.count;
    });
  },
});

export default FeatureSlice.reducer;
