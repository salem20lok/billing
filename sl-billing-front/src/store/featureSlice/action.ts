import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";
import { fetchFeatureState } from "./type";

export const fetchFeatures = createAsyncThunk(
  "features/fetchFeature",
  async (state: fetchFeatureState) => {
    const { skip, limit, featureName } = state;
    const res = await axios.get(process.env.REACT_APP_API_URL + "/feature", {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.Feature,
        skip: skip,
        limit: limit,
        featureName: featureName,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
    return res.data;
  }
);
