import axios from "axios";
import { UserPermission } from "../../@Types/UserPermission";

export function getUserPermissionAction(
  id: string,
  callback: (data: UserPermission[]) => void
) {
  axios
    .get(process.env.REACT_APP_API_URL + "/user-permission/user/" + id, {
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
