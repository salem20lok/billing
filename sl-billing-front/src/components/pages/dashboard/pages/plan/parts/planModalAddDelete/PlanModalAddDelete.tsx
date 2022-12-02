import { PlanType } from "../../../../../../../@Types/PlanType";
import { useEffect, useState } from "react";
import { isName } from "../../../../../../../utils/validation/name";
import { PermissionNameEnum } from "../../../../../../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../../../../../../@Types/PermissionEnumFront";
import { addPlan, updatePlan } from "../../../../../../../actions/plan/action";
import Features from "../features/Features";
import { debounce } from "lodash";
import { getFeaturesByPlan } from "../../../../../../../actions/feature/action";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../store";
import { RoleEnumFront } from "../../../../../../../@Types/RoleEnum";

interface PlanModalInterfaceProps {
  handleCloseModal: Function;
  action: string;
  plan?: PlanType;
  handleRefresh: Function;
}

const PlanModalAddDelete = (props: PlanModalInterfaceProps) => {
  const { handleCloseModal, action, plan, handleRefresh } = props;

  const [planFeature, setPlanFeature] = useState<string[]>([]);
  const [query, setQuery] = useState<PlanType>({
    planName: plan ? plan.planName : "",
    _id: plan ? plan._id : "",
    name: action === "add" ? PermissionNameEnum.Add : PermissionNameEnum.Update,
    management: PermissionEnum.Plan,
    deleteFeature: [],
    addFeature: [],
  });
  const [queryError, setQueryError] = useState({
    planName: plan ? isName(plan.planName) : false,
  });

  const handleAdd = () => {
    addPlan(query, (res, msg) => {
      handleRefresh(res, msg);
    });
  };

  const handleUpdate = () => {
    updatePlan(query, (res, msg) => {
      handleRefresh(res, msg);
    });
  };

  const getPlanFeature = debounce(() => {
    getFeaturesByPlan(plan?._id || "", (data) => {
      setQuery({ ...query, feature: data });
      setPlanFeature(data);
    });
  }, 0);

  useEffect(() => {
    if (action === "update") {
      getPlanFeature();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFeature = (payload: string) => {
    let feature: string[] = [];
    if (payload !== "") {
      if (query.feature) {
        query.feature?.includes(payload)
          ? (feature = query.feature.filter((el) => el !== payload))
          : (feature = [...query.feature, payload]);
      }
    }

    let deleteFeature: string[] = [];
    planFeature.forEach((el) => {
      if (!feature.includes(el)) {
        deleteFeature = [...deleteFeature, el];
      }
    });

    let addFeature: string[] = [];
    feature.forEach((el) => {
      if (!planFeature.includes(el)) {
        addFeature = [...addFeature, el];
      }
    });

    setQuery({
      ...query,
      feature: feature,
      addFeature: addFeature,
      deleteFeature: deleteFeature,
    });
  };

  const handleDeleteAllFeature = () => {
    let feature: string[] = [];

    let deleteFeature: string[] = [];
    planFeature.forEach((el) => {
      if (!feature.includes(el)) {
        deleteFeature = [...deleteFeature, el];
      }
    });

    let addFeature: string[] = [];
    feature.forEach((el) => {
      if (!planFeature.includes(el)) {
        addFeature = [...addFeature, el];
      }
    });

    setQuery({
      ...query,
      feature: feature,
      addFeature: addFeature,
      deleteFeature: deleteFeature,
    });
  };

  const consumer = useSelector((state: RootState) => {
    return state.user;
  });

  return (
    <>
      <div
        onClick={() => handleCloseModal()}
        id="popup-modal"
        tabIndex={-1}
        className="fixed w-full h-full  top-0 left-0 bg-black bg-opacity-40 overflow-y-auto fixed z-30 md:inset-0 h-modal md:h-full"
      />

      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        }}
        className="absolute z-50 p-4 w-full max-w-2xl h-full md:h-auto"
      >
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {action} plan
            </h3>
            <button
              onClick={() => handleCloseModal()}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div
            style={{ height: 570 }}
            className="p-6 space-y-6 h-96 overflow-y-auto  "
          >
            <form autoComplete="off">
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  name="floating_plan"
                  id="floating_plan"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={query.planName}
                  onChange={(e) => {
                    setQuery({ ...query, planName: e.target.value });
                    setQueryError({
                      ...queryError,
                      planName: isName(e.target.value),
                    });
                  }}
                />
                <label
                  htmlFor="floating_plan"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  plan name
                </label>
                {queryError.planName || query.planName === "" ? (
                  ""
                ) : (
                  <span className="text-red-500 text-xs p-1">
                    please check correct plan name !
                  </span>
                )}
              </div>
              {(consumer.user.role === RoleEnumFront.SuperAdmin ||
                (consumer.user.role === RoleEnumFront.Admin &&
                  consumer.permission.some((el) => {
                    return (
                      el.permission.management === PermissionEnum.Team &&
                      el.permission.name === PermissionNameEnum.Update
                    );
                  }) &&
                  action === "update") ||
                (consumer.permission.some((el) => {
                  return (
                    el.permission.management === PermissionEnum.Team &&
                    el.permission.name === PermissionNameEnum.Add
                  );
                }) &&
                  action === "add")) && (
                <Features
                  handleFeature={handleFeature}
                  handleDeleteAllFeature={handleDeleteAllFeature}
                  query={query}
                />
              )}
            </form>
          </div>
          {/* Modal footer */}
          <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600 justify-end ">
            <button
              onClick={() => handleCloseModal()}
              data-modal-toggle="defaultModal"
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Decline
            </button>
            <button
              onClick={() => (action === "add" ? handleAdd() : handleUpdate())}
              data-modal-toggle="defaultModal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              I accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanModalAddDelete;
