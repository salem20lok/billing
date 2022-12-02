import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";
import { fetchTeamsState } from "./type";

export const fetchTeams = createAsyncThunk(
  "teams/fetchTeam",
  async (state: fetchTeamsState) => {
    const { skip, limit, teamName } = state;
    const res = await axios.get(process.env.REACT_APP_API_URL + "/team", {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.Team,
        skip: skip,
        limit: limit,
        teamName: teamName,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
    return res.data;
  }
);
