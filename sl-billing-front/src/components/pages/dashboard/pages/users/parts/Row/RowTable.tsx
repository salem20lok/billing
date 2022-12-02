import User from "../../../../../../../@Types/User";
import DeleteUser from "../deleteUser/DeleteUser";
import { Permission } from "../../../../../../../@Types/Permission";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../store";
import { PermissionNameEnum } from "../../../../../../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../../../../../../@Types/PermissionEnumFront";
import { RoleEnumFront } from "../../../../../../../@Types/RoleEnum";
import { TeamType } from "../../../../../../../@Types/Team";

interface RowTableInterfaceProps {
  user: User;
  handleRefresh: Function;
  allPermission: Permission[];
  allTeams: TeamType[];
  handleShowModal: Function;
}

const RowTable = (props: RowTableInterfaceProps) => {
  const { user, handleRefresh, handleShowModal } = props;

  const consumer = useSelector((state: RootState) => {
    return state.user;
  });

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th
        scope="row"
        className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img
          className="w-10 h-10 rounded-full"
          src={
            user.avatar === undefined ||
            user.avatar === "" ||
            user.avatar === null
              ? "/images/avatar.png"
              : user.avatar
          }
          alt="Jese"
        />
        <div className="pl-3">
          <div className="text-base font-semibold">
            {user.firstName + " " + user.lastName}
          </div>
          <div className="font-normal text-gray-500">{user.email}</div>
        </div>
      </th>
      <td className="py-4 px-6">{user.role}</td>
      <td className="py-4 px-6">
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2" />
          soon
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="font-medium text-blue-600 dark:text-blue-500 ">
          <div
            className="flex rounded-md shadow-sm justify-center "
            role="group"
          >
            {consumer.permission.some(
              (el) =>
                el.permission.name === PermissionNameEnum.Delete &&
                el.permission.management === PermissionEnum.User
            ) || consumer.user.role === RoleEnumFront.SuperAdmin ? (
              <DeleteUser user={user} handleRefresh={handleRefresh} />
            ) : (
              ""
            )}
            {consumer.permission.some(
              (el) =>
                el.permission.name === PermissionNameEnum.Update &&
                el.permission.management === PermissionEnum.User
            ) || consumer.user.role === RoleEnumFront.SuperAdmin ? (
              <button
                onClick={() => {
                  handleShowModal("update", user);
                }}
                type="button"
                className={
                  "py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-900 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-900 dark:focus:ring-blue-500 dark:focus:text-white"
                }
              >
                update
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default RowTable;
