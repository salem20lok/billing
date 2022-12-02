import axios from "axios";
import User from "../../@Types/User";
import { UserPermission } from "../../@Types/UserPermission";

export function identificationAction(
  callback: (
    res: boolean,
    data: { user: User; permission: UserPermission[] }
  ) => void
) {
  axios
    .get(process.env.REACT_APP_API_URL + "/user/identification", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then(({ data }) => {
      callback(true, data);
    })
    .catch(() => {
      callback(false, {
        permission: [],
        user: {
          _id: "",
          firstName: "",
          email: "",
          role: "",
          lastName: "",
          avatar: "",
        },
      });
    });
}
