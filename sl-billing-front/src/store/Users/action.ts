import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsersState } from "./Type";
import axios from "axios";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (state: fetchUsersState) => {
    const { skip, limit, firstName } = state;
    const res = await axios.get(process.env.REACT_APP_API_URL + "/user", {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.User,
        skip: skip,
        limit: limit,
        firstName: firstName,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
    return res.data;
  }
);
