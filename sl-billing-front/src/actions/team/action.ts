import axios from "axios";
import { TeamType } from "../../@Types/Team";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";
import { TeamUser } from "../../@Types/TeamUser";

export function addTeam(
  team: TeamType,
  callback: (res: boolean, msg: string) => void
) {
  if (!team.users?.length) {
    delete team.users;
  }
  delete team._id;
  axios
    .post(process.env.REACT_APP_API_URL + "/team", team, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then(() => {
      callback(true, "");
    })
    .catch((e) => {
      callback(false, e.response.data.message);
    });
}

export function updateTeam(
  team: TeamType,
  callback: (res: boolean, msg: string) => void
) {
  if (!team.users?.length) {
    delete team.users;
  }
  const { _id } = team;
  delete team._id;

  axios
    .put(process.env.REACT_APP_API_URL + "/team/" + _id, team, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then(() => {
      callback(true, "");
    })
    .catch((e) => {
      callback(false, e.response.data.message);
    });
}

export function deleteTeam(
  id: string,
  callback: (res: boolean, msg: string) => void
) {
  axios
    .delete(process.env.REACT_APP_API_URL + "/team/" + id, {
      data: {
        name: PermissionNameEnum.Delete,
        management: PermissionEnum.Team,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then(() => {
      callback(true, "");
    })
    .catch((e) => {
      callback(false, e.response.data.message);
    });
}

export function getAllTeam(callback: (data: TeamType[]) => void) {
  axios
    .get(process.env.REACT_APP_API_URL + "/team/all-teams", {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.Team,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      console.log(e.response.data.message);
    });
}

export function getTeamUserByUser(
  id: string,
  callback: (data: string[]) => void
) {
  axios
    .get(process.env.REACT_APP_API_URL + "/team-user/user/" + id, {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.Team,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then(({ data }) => {
      let res: string[] = [];
      data.forEach((el: TeamUser) => {
        if (el.team) {
          if (el.team._id) res = [...res, el.team._id];
        }
      });
      callback(res);
    })
    .catch((e) => {
      console.log(e.response.data.message);
    });
}
