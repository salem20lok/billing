import axios from "axios";
import { Permission } from "../../@Types/Permission";

export function getPermissionAction(callback: (data: Permission[]) => void) {
  axios
    .get(process.env.REACT_APP_API_URL + "/permission/all-permission", {
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
