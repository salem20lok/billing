import React, { PropsWithChildren } from "react";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { AppStore, RootState, setupStore } from "../../store";
import { initialState as userInitialState } from "../../store/UserSlice/Slice";
import { initialState } from "../../store/Users/Slice";
import { initialState as teamsInitialState } from "../../store/teamsSlice/slice";
import { initialState as plansInitialState } from "../../store/planSlice/slice";
import { initialState as featuresInitialState } from "../../store/featureSlice/slice";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      users: initialState,
      user: userInitialState,
      teams: teamsInitialState,
      plans: plansInitialState,
      features: featuresInitialState,
    },

    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
