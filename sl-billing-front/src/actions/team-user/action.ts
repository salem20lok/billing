import axios from "axios";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";
import { TeamUser } from "../../@Types/TeamUser";

export function getTeamUserAction(
  id: string,
  callback: (data: string[]) => void
) {
  axios
    .get(process.env.REACT_APP_API_URL + "/team-user/team/" + id, {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.Team,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then(({ data }) => {
      let teamUser: string[] = [];
      data.forEach((el: TeamUser) => {
        if (el.user) {
          if (el.user._id) {
            teamUser = [...teamUser, el.user._id];
          }
        }
      });
      callback(teamUser);
    })
    .catch((e) => {
      console.log(e.response.data.message);
    });
}
