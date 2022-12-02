import { PlanType } from "../../../../../../../@Types/PlanType";
import moment from "moment/moment";
import { TeamType } from "../../../../../../../@Types/Team";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../store";
import { PermissionNameEnum } from "../../../../../../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../../../../../../@Types/PermissionEnumFront";
import { RoleEnumFront } from "../../../../../../../@Types/RoleEnum";
import { useState } from "react";

interface PlanRowTableInterface {
  plan: PlanType;
  handleShowModal: Function;
  showModalDelete: Function;
  teamsPlan?: TeamType[];
}

const PlanRowTable = (props: PlanRowTableInterface) => {
  const { plan, handleShowModal, showModalDelete, teamsPlan } = props;

  const [tooltip, setTooltip] = useState<string>("");

  const consumer = useSelector((state: RootState) => {
    return state.user;
  });

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th
        scope="row"
        className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white"
      >
        {/*   <img
          className="w-10 h-10 rounded-full"
          src={"/images/team.png"}
          alt="Jese image"
        /> */}
        <div className="pl-3">
          <div className="text-base font-semibold">{plan.planName}</div>
          <div className="font-normal text-gray-500">
            {moment(plan.createdAt).format("YYYY-MM-DD")}
          </div>
        </div>
      </th>
      <td className="py-4 px-6">
        <div className="flex -space-x-1 overflow-hidden">
          {/* eslint-disable-next-line array-callback-return */}
          {teamsPlan?.map((el) => {
            if (el.plan === plan._id) {
              return (
                <div key={el._id}>
                  <img
                    onMouseEnter={() => {
                      setTooltip(el._id || "");
                    }}
                    onMouseOut={() => setTooltip("")}
                    data-tooltip-target="tooltip-dark"
                    className="inline-block h-6 w-6 rounded-full border-2 border-blueGray-50 shadow   "
                    src={el.avatar ? el.avatar : "/images/team.png"}
                    alt={el.teamName}
                  />

                  {tooltip === el._id && (
                    <div
                      id="tooltip-dark"
                      role="tooltip"
                      className="inline-block absolute  z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700"
                    >
                      {el.teamName}
                      <div className="tooltip-arrow"></div>
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="font-medium text-blue-600 dark:text-blue-500 ">
          <div
            className="flex rounded-md shadow-sm justify-center "
            role="group"
          >
            {(consumer.permission.some(
              (el) =>
                el.permission.name === PermissionNameEnum.Delete &&
                el.permission.management === PermissionEnum.Plan
            ) ||
              consumer.user.role === RoleEnumFront.SuperAdmin) && (
              <button
                onClick={() => {
                  showModalDelete(plan);
                }}
                type="button"
                className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-900 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-900 dark:focus:ring-blue-500 dark:focus:text-white"
              >
                delete
              </button>
            )}

            {(consumer.permission.some(
              (el) =>
                el.permission.name === PermissionNameEnum.Update &&
                el.permission.management === PermissionEnum.Plan
            ) ||
              consumer.user.role === RoleEnumFront.SuperAdmin) && (
              <button
                onClick={() => {
                  handleShowModal("update", plan);
                }}
                type="button"
                className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-900 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-900 dark:focus:ring-blue-500 dark:focus:text-white"
              >
                update
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default PlanRowTable;
