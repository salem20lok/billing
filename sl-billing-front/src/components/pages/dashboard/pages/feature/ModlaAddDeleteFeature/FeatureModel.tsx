import { isName } from "../../../../../../utils/validation/name";
import { FeatureType } from "../../../../../../@Types/feature";
import { useState } from "react";
import { PermissionNameEnum } from "../../../../../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../../../../../@Types/PermissionEnumFront";
import {
  addFeature,
  updateFeature,
} from "../../../../../../actions/feature/action";
import { RoleEnumFront } from "../../../../../../@Types/RoleEnum";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import PlansSelect from "../featuresSelect/PlansSelect";

interface FeatureModelRowTableInterface {
  handleCloseModal: Function;
  action: string;
  feature?: FeatureType;
  handleRefresh: Function;
}

const FeatureModel = (props: FeatureModelRowTableInterface) => {
  const { feature, handleCloseModal, handleRefresh, action } = props;
  const [query, setQuery] = useState<FeatureType>({
    featureName: feature ? feature.featureName : "",
    _id: feature ? feature._id : "",
    name: action === "add" ? PermissionNameEnum.Add : PermissionNameEnum.Update,
    management: PermissionEnum.Feature,
    plans: [],
  });

  const [queryError, setQueryError] = useState({
    featureName: feature ? isName(feature.featureName) : false,
  });

  const handleAddFeature = () => {
    addFeature(query, (res, msg) => {
      handleRefresh(res, msg);
    });
  };

  const handleUpdateFeature = () => {
    updateFeature(query, (res, msg) => {
      handleRefresh(res, msg);
    });
  };

  const handlePlan = (payload: string) => {
    let plans: string[] = [];
    if (payload !== "") {
      if (query.plans) {
        query.plans?.includes(payload)
          ? (plans = query.plans.filter((el) => el !== payload))
          : (plans = [...query.plans, payload]);
      }
    }
    setQuery({ ...query, plans: plans });
  };

  const handleDeleteAllPlans = () => {
    setQuery({ ...query, plans: [] });
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
              {action} Feature
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
          <div className="p-6 h-56   space-y-6 ">
            <form autoComplete="off">
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  name="floating_plan"
                  id="floating_plan"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={query.featureName}
                  onChange={(e) => {
                    setQuery({ ...query, featureName: e.target.value });
                    setQueryError({
                      ...queryError,
                      featureName: isName(e.target.value),
                    });
                  }}
                />
                <label
                  htmlFor="floating_plan"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  feature name
                </label>
                {queryError.featureName || query.featureName === "" ? (
                  ""
                ) : (
                  <span className="text-red-500 text-xs p-1">
                    please check correct plan name !
                  </span>
                )}
              </div>
              {action === "add" &&
                (consumer.permission.some(
                  (el) =>
                    el.permission.name === PermissionNameEnum.Add &&
                    el.permission.management === PermissionEnum.Plan
                ) ||
                  consumer.user.role === RoleEnumFront.SuperAdmin) && (
                  <PlansSelect
                    handlePlans={handlePlan}
                    handleDeleteAllPlans={handleDeleteAllPlans}
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
              onClick={() => {
                action === "add" ? handleAddFeature() : handleUpdateFeature();
              }}
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

export default FeatureModel;
