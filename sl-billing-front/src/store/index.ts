import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import { useDispatch } from "react-redux";

import UserSlice from "./UserSlice/Slice";
import UsersSlice from "./Users/Slice";
import TeamsSlice from "./teamsSlice/slice";
import PlansSlice from "./planSlice/slice";
import FeaturesSlice from "./featureSlice/slice";

export const store = configureStore({
  reducer: {
    user: UserSlice,
    users: UsersSlice,
    teams: TeamsSlice,
    plans: PlansSlice,
    features: FeaturesSlice,
  },
  middleware: [thunkMiddleware],
});

// for test
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: combineReducers({ user: UserSlice }),
    preloadedState,
  });
}

export type RootState = ReturnType<typeof store.getState>;
//for test
export type AppStore = ReturnType<typeof setupStore>;
export const useAppDispatch: any = () => useDispatch();
