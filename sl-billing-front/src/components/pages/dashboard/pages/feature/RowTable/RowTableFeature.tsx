import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import moment from "moment";
import { PermissionNameEnum } from "../../../../../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../../../../../@Types/PermissionEnumFront";
import { RoleEnumFront } from "../../../../../../@Types/RoleEnum";
import { FeatureType } from "../../../../../../@Types/feature";

interface FeatureRowTableInterface {
  featureState: FeatureType;
  handleShowModal: Function;
  showModalDelete: Function;
}

const RowTableFeature = (props: FeatureRowTableInterface) => {
  const { featureState, handleShowModal, showModalDelete } = props;

  const consumer = useSelector((state: RootState) => {
    return state.user;
  });

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th
        scope="row"
        className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white"
      >
        <div className="pl-3">
          <div className="text-base font-semibold">
            {featureState.featureName}
          </div>
          <div className="font-normal text-gray-500">
            {moment(featureState.createdAt).format("YYYY-MM-DD")}
          </div>
        </div>
      </th>
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
                  showModalDelete(featureState);
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
                  handleShowModal("update", featureState);
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

export default RowTableFeature;
