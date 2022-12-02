import axios from "axios";
import { planPaginationType, PlanType } from "../../@Types/PlanType";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";

export function addPlan(
  plan: PlanType,
  callback: (res: boolean, msg: string) => void
) {
  delete plan._id;
  axios
    .post(process.env.REACT_APP_API_URL + "/plan", plan, {
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

export function updatePlan(
  plan: PlanType,
  callback: (res: boolean, msg: string) => void
) {
  const { _id } = plan;
  delete plan._id;
  axios
    .put(process.env.REACT_APP_API_URL + "/plan/" + _id, plan, {
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

export function deletePlan(
  id: string,
  callback: (res: boolean, msg: string) => void
) {
  axios
    .delete(process.env.REACT_APP_API_URL + "/plan/" + id, {
      data: {
        name: PermissionNameEnum.Delete,
        management: PermissionEnum.Plan,
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

export function getAllPlan(callback: (data: PlanType[]) => void) {
  axios
    .get(process.env.REACT_APP_API_URL + "/plan/all-plan/", {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.Plan,
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

export function getPlansPagination(
  query: { skip: number; limit: number; planName: string },
  callback: (data: planPaginationType) => void
) {
  const { skip, limit, planName } = query;
  axios
    .get(process.env.REACT_APP_API_URL + "/plan", {
      params: {
        skip: skip,
        limit: limit,
        planName: planName,
        name: PermissionNameEnum.View,
        management: PermissionEnum.Plan,
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
