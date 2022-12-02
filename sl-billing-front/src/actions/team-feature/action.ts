import axios from "axios";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";

export function getTeamFeaturesByTeam(
  id: string,
  callback: (data: string[]) => void
) {
  axios
    .get(process.env.REACT_APP_API_URL + "/team-feature/team/" + id, {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.Team,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then(({ data }) => {
      console.log("data : ", data);
      let res: string[] = [];
      data.forEach((el: { _id: string; team: string; feature: string }) => {
        res = [...res, el.feature];
      });
      callback(res);
    })
    .catch((e) => {
      console.log(e.response.data.message);
    });
}
