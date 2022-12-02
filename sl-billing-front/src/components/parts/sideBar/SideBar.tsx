import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { PermissionEnum } from "../../../@Types/PermissionEnumFront";
import { RoleEnumFront } from "../../../@Types/RoleEnum";
import { PermissionNameEnum } from "../../../@Types/PermissionNameEnumFront";

const navigation = [
  {
    name: "users",
    href: "/users",
    svg: (
      <svg
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    enum: PermissionEnum.User,
  },
  {
    name: "permission",
    href: "/permission",
    svg: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
    enum: "Permission",
  },
  {
    name: "team",
    href: "/team",
    svg: (
      <svg
        className="w-6 h-6"
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
    ),
    enum: PermissionEnum.Team,
  },
];

const navigation2 = [
  {
    name: "plan",
    href: "/plan",
    svg: (
      <svg
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    enum: PermissionEnum.Plan,
  },
  {
    name: "feature",
    href: "/feature",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
      </svg>
    ),
    enum: PermissionEnum.Feature,
  },
];

const SideBar = () => {
  const location = useLocation().pathname;

  const user = useSelector((state: RootState) => {
    return state.user;
  });

  const handlePermission = (payload: string): boolean => {
    return user.permission.some(
      (el) =>
        el.permission.name === PermissionNameEnum.View &&
        el.permission.management === payload
    );
  };

  return (
    <div className="flex flex-col w-56 border-r border-gray-300">
      <div className="max-w-xs p-4 bg-gray-800  sm:flex sm:flex-col h-full ">
        <span className="border-solid border-b-2 h-11 mb-6 flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white ">
          <svg
            aria-hidden="true"
            className="w-9 h-9 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          <span className="ml-3">Dashboard</span>
        </span>

        <ul className="flex flex-col w-full">
          <li className="my-px">
            <Link
              className={
                location === "/"
                  ? "flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 bg-gray-100"
                  : "flex flex-row items-center h-12 px-4 rounded-lg text-gray-500 hover:bg-gray-700"
              }
              to="/"
            >
              <span className="flex items-center justify-center text-lg text-gray-500">
                <svg
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
              <span className="ml-3">Home</span>
              <span className="flex items-center justify-center text-sm text-gray-500 font-semibold bg-gray-300 h-6 px-2 rounded-full ml-auto">
                3
              </span>
            </Link>
          </li>
          <li className="my-px">
            <span className="flex font-medium text-sm text-gray-400 px-4 my-4 uppercase">
              Navigation
            </span>
          </li>

          {/* eslint-disable-next-line array-callback-return */}
          {navigation.map((el, idx) => {
            if (
              user.user.role === RoleEnumFront.SuperAdmin ||
              handlePermission(el.enum)
            ) {
              return (
                <li key={idx} className="my-px">
                  <Link
                    to={el.href}
                    className={
                      location === el.href
                        ? "flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 bg-gray-100"
                        : "flex flex-row items-center h-12 px-4 rounded-lg text-gray-500 hover:bg-gray-700"
                    }
                  >
                    <span className="flex items-center justify-center text-lg text-gray-500">
                      {el.svg}
                    </span>
                    <span className="ml-3">{el.name}</span>
                  </Link>
                </li>
              );
            }
          })}

          <li className="my-px">
            <span className="flex font-medium text-sm text-gray-400 px-4 my-4 uppercase">
              Account
            </span>
          </li>
          {/* eslint-disable-next-line array-callback-return */}
          {navigation2.map((el, idx) => {
            if (
              user.user.role === RoleEnumFront.SuperAdmin ||
              handlePermission(el.enum)
            ) {
              return (
                <li key={idx} className="my-px">
                  <Link
                    to={el.href}
                    className={
                      location === el.href
                        ? "flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 bg-gray-100"
                        : "flex flex-row items-center h-12 px-4 rounded-lg text-gray-500 hover:bg-gray-700"
                    }
                  >
                    <span className="flex items-center justify-center text-lg text-gray-500">
                      {el.svg}
                    </span>
                    <span className="ml-3">{el.name}</span>
                  </Link>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
