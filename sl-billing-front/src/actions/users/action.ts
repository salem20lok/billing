import User from "../../@Types/User";
import axios from "axios";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";

export function addUser(
  user: User,
  callback: (res: boolean, msg: string) => void
) {
  if (!user.permission || user.permission?.length === 0) {
    delete user.permission;
  }
  delete user._id;

  axios
    .post(process.env.REACT_APP_API_URL + "/user", user, {
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

export function updateUser(
  user: User,
  callback: (res: boolean, msg: string) => void
) {
  delete user.permission;
  const { _id } = user;
  delete user._id;
  axios
    .put(process.env.REACT_APP_API_URL + "/user/" + _id, user, {
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

export function deleteUser(
  id: string,
  callback: (res: boolean, msg: string) => void
) {
  axios
    .delete(process.env.REACT_APP_API_URL + "/user/" + id, {
      data: {
        name: PermissionNameEnum.Delete,
        management: PermissionEnum.User,
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

export function getAllUsers(callback: (data: User[]) => void) {
  axios
    .get(process.env.REACT_APP_API_URL + "/user/all-user", {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.User,
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
