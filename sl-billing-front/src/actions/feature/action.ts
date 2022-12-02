import axios from "axios";
import { PermissionNameEnum } from "../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../@Types/PermissionEnumFront";
import { FeaturePaginationType, FeatureType } from "../../@Types/feature";
import { PlanFeatureType } from "../../@Types/PlanFeature";

export function addFeature(
  feature: FeatureType,
  callback: (res: boolean, msg: string) => void
) {
  delete feature._id;
  axios
    .post(process.env.REACT_APP_API_URL + "/feature", feature, {
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

export function updateFeature(
  feature: FeatureType,
  callback: (res: boolean, msg: string) => void
) {
  const { _id } = feature;
  delete feature._id;
  axios
    .put(process.env.REACT_APP_API_URL + "/feature/" + _id, feature, {
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

export function deleteFeature(
  id: string,
  callback: (res: boolean, msg: string) => void
) {
  axios
    .delete(process.env.REACT_APP_API_URL + "/feature/" + id, {
      data: {
        name: PermissionNameEnum.Delete,
        management: PermissionEnum.Feature,
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

export function getFeaturePagination(
  query: { skip: number; limit: number; featureName: string },
  callback: (data: FeaturePaginationType) => void
) {
  const { skip, limit, featureName } = query;
  axios
    .get(process.env.REACT_APP_API_URL + "/feature", {
      params: {
        skip: skip,
        limit: limit,
        featureName: featureName,
        name: PermissionNameEnum.View,
        management: PermissionEnum.Feature,
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

export function getFeaturesByPlan(
  id: string,
  callback: (data: string[]) => void
) {
  axios
    .get(process.env.REACT_APP_API_URL + "/plan-feature/plan/" + id, {
      params: {
        name: PermissionNameEnum.View,
        management: PermissionEnum.Feature,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
    .then(({ data }) => {
      let res: string[] = [];
      data.forEach((el: PlanFeatureType) => {
        if (el.feature._id) {
          res = [...res, el.feature._id];
        }
      });
      callback(res);
    })
    .catch((e) => {
      console.log(e.response.data.message);
    });
}
