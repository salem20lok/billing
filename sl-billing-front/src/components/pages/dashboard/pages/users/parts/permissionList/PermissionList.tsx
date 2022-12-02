import { PermissionEnum } from "../../../../../../../@Types/PermissionEnumFront";
import { PermissionNameEnum } from "../../../../../../../@Types/PermissionNameEnumFront";
import { useEffect, useState } from "react";
import { RoleEnumFront } from "../../../../../../../@Types/RoleEnum";
import { Permission } from "../../../../../../../@Types/Permission";

interface PermissionListInterface {
  permission: string[];
  allPermission: Permission[];
  handlePermissionModal: (payload: string[]) => void;
}

const PermissionList = (props: PermissionListInterface) => {
  const { allPermission, handlePermissionModal, permission } = props;

  const [permissionSelected, setPermissionSelected] = useState<string>(
    RoleEnumFront.User
  );
  const [optionPermission, setOptionPermission] = useState<Permission[]>([]);

  /**
   * @description handlePermission , save management permission , filter permission for management
   * @param {string} payload the payload  management Permission .
   */
  const handlePermission = (payload: string) => {
    setPermissionSelected(payload);
    setOptionPermission(() =>
      allPermission.filter((el) => el.management === payload)
    );
  };

  /**
   * @description HandleViewSelected , if selected permission update , add , delete ,the view permission should be added automatically
   * @param {string} payload the payload string to management name .
   */
  const HandleViewSelected = (payload: string) => {
    const management = allPermission.filter((el) => el._id === payload);
    const view = allPermission.filter(
      (el) =>
        el.name === PermissionNameEnum.View &&
        el.management === management[0].management
    );
    return view[0]._id;
  };

  /**
   * @description handlePermissionSelected , delete , add permission
   * @param {string} payload the id string to permission .
   */
  const handlePermissionSelected = (payload: string) => {
    let permissionPayload: string[];
    if (
      !permission.includes(HandleViewSelected(payload)) &&
      HandleViewSelected(payload) !== payload
    ) {
      permission.includes(payload)
        ? (permissionPayload = permission.filter((el) => el !== payload))
        : (permissionPayload = [
            ...permission,
            payload,
            HandleViewSelected(payload),
          ]);
    } else {
      permission.includes(payload)
        ? (permissionPayload = permission.filter((el) => el !== payload))
        : (permissionPayload = [...permission, payload]);
    }

    /* permission.includes(payload)
           ? handleAddDeletePermission(payload, "add")
           : handleAddDeletePermission(payload, "delete"); */

    handlePermissionModal(permissionPayload);
  };

  useEffect(() => {
    setOptionPermission(() =>
      allPermission.filter(
        (el: Permission) => el.management === RoleEnumFront.User
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="bottom-navigation" className="text-gray-500">
      <div id="tabs" className="flex justify-between">
        <span
          onClick={() => handlePermission(PermissionEnum.User)}
          className={
            permissionSelected === PermissionEnum.User
              ? " cursor-pointer w-full text-teal-500 text-teal-500 justify-center inline-block text-center pt-2 pb-1"
              : " cursor-pointer w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
          }
        >
          <svg
            width={25}
            height={25}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="inline-block mb-1"
          >
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="tab tab-home block text-xs">User Permission</span>
        </span>
        <span
          onClick={() => handlePermission(PermissionEnum.Team)}
          className={
            permissionSelected === PermissionEnum.Team
              ? " cursor-pointer w-full text-teal-500 text-teal-500 justify-center inline-block text-center pt-2 pb-1"
              : " cursor-pointer w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
          }
        >
          <svg
            width={25}
            height={25}
            className="inline-block mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="tab tab-kategori block text-xs">
            Team Permission
          </span>
        </span>
        <span
          onClick={() => handlePermission(PermissionEnum.Plan)}
          className={
            permissionSelected === PermissionEnum.Plan
              ? " cursor-pointer w-full text-teal-500 text-teal-500 justify-center inline-block text-center pt-2 pb-1"
              : " cursor-pointer w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
          }
        >
          <svg
            width={25}
            height={25}
            className="inline-block mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="tab tab-whishlist block text-xs">
            Plan Permission
          </span>
        </span>
        <span
          onClick={() => handlePermission(PermissionEnum.Feature)}
          className={
            permissionSelected === PermissionEnum.Feature
              ? " cursor-pointer w-full text-teal-500 text-teal-500 justify-center inline-block text-center pt-2 pb-1"
              : " cursor-pointer w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
          }
        >
          <svg
            width={25}
            height={25}
            className="inline-block mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="tab tab-account block text-xs">
            Feature Permission
          </span>
        </span>
      </div>
      <div>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {optionPermission.map((el, idx) => {
            return (
              <li
                key={idx}
                className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
              >
                <div className="flex items-center pl-3">
                  <input
                    disabled={
                      el.name === PermissionNameEnum.View &&
                      // eslint-disable-next-line array-callback-return
                      allPermission.some((el) => {
                        if (
                          el.management === permissionSelected &&
                          permission.includes(el._id) &&
                          el.name !== PermissionNameEnum.View
                        ) {
                          return true;
                        }
                      })
                    }
                    value={el._id}
                    onChange={(e) => {
                      handlePermissionSelected(e.target.value);
                    }}
                    type="checkbox"
                    checked={permission.includes(el._id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">
                    {el.name + " " + el.management}
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PermissionList;
