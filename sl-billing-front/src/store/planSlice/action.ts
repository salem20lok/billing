import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";
import { fetchPlansState } from "./type";

export const fetchPlans = createAsyncThunk(
  "plans/fetchPlan",
  async (state: fetchPlansState) => {
    const { skip, limit, planName } = state;
    const res = await axios.get(process.env.REACT_APP_API_URL + "/plan", {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.Plan,
        skip: skip,
        limit: limit,
        planName: planName,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
    return res.data;
  }
);
