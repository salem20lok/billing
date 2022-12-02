import { RootState, useAppDispatch } from "../../../../../store";
import React, { useEffect, useRef, useState } from "react";
import { fetchUsers } from "../../../../../store/Users/action";
import { useSelector } from "react-redux";
import RowTable from "./parts/Row/RowTable";
import { debounce } from "lodash";
import { Permission } from "../../../../../@Types/Permission";
import { RoleEnumFront } from "../../../../../@Types/RoleEnum";
import { PermissionNameEnum } from "../../../../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../../../../@Types/PermissionEnumFront";
import { getPermissionAction } from "../../../../../actions/permission/action";
import Loading from "../../../../parts/load/loading";
import { TeamType } from "../../../../../@Types/Team";
import { getAllTeam } from "../../../../../actions/team/action";
import User from "../../../../../@Types/User";
import ModalUser from "./parts/modalAddUpdate/ModalUser";
import DangerAlert from "../../../../../utils/dangerAlert/DangerAlert";
import AlertSuccess from "../../../../../utils/alertSuccess/AlertSuccess";
import { saveProfilePayload } from "../../../../../store/UserSlice/type";

interface UsersInterfaceProps {
  consumer: saveProfilePayload;
}

const Users = (props: UsersInterfaceProps) => {
  const { consumer } = props;

  const isMounting = useRef(false);

  const dispatch = useAppDispatch();
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleRefresh = (res: boolean, msg: string) => {
    if (res) {
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      setTimeout(() => {
        setPage(1);
        setRefresh(!refresh);
      }, 250);
      handleCloseModal();
      setSuccess(true);
    } else {
      setErrorMsg(msg);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setError(true);
    }
  };

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [allPermission, setAllPermission] = useState<Permission[]>([]);
  const [allTeams, setAllTeams] = useState<TeamType[]>([]);

  const debouncePermission = debounce(() => {
    dispatch(fetchUsers({ limit: 5, skip: (page - 1) * 5, firstName: search }));
  }, 0);

  useEffect(() => {
    if (!isMounting.current) {
      getPermissionAction(setAllPermission);
      getAllTeam(setAllTeams);
      isMounting.current = true;
    }
    debouncePermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refresh]);

  const handleChange = debounce(() => {
    setRefresh(!refresh);
  }, 1000);

  const users = useSelector((state: RootState) => {
    return state.users;
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [action, setAction] = useState<string>("add");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [userState, setUserState] = useState<User>({
    role: "",
    lastName: "",
    firstName: "",
    email: "",
  });
  const handleShowModal = (payload: string, user?: User) => {
    setShowModal(true);
    setAction(payload);
    if (payload === "update" && user) {
      setUserState(user);
    }
  };

  const handleCloseModal = () => {
    setUserState({
      role: "",
      lastName: "",
      firstName: "",
      email: "",
    });
    setShowModal(false);
  };
  const handleCloseAlert = () => {
    setError(false);
  };

  return users.loading ? (
    <Loading />
  ) : (
    <>
      <div className=" flex justify-between items-center pb-4  ">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            autoComplete="off"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleChange();
            }}
            type="text"
            id="table-search-users"
            className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for users"
          />
        </div>
        {consumer.permission.some(
          (el) =>
            el.permission.name === PermissionNameEnum.Add &&
            el.permission.management === PermissionEnum.User
        ) || consumer.user.role === RoleEnumFront.SuperAdmin ? (
          <button
            onClick={() => {
              handleShowModal("add");
            }}
            type="button"
            className="focus:outline-none border-gray-300 px-3 py-1.5 bg-gray-800 rounded-md text-white outline-none focus:ring-gray-200 shadow-lg transform active:scale-x-75 transition-transform mx-5 flex items-center"
          >
            <span className="ml-2">Add User</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="overflow-x-auto relative sm:rounded-lg ">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                full name
              </th>
              <th scope="col" className="py-3 px-6">
                Role
              </th>
              <th scope="col" className="py-3 px-6">
                Team
              </th>
              <th scope="col" className="py-3 px-6" />
            </tr>
          </thead>
          <tbody>
            {users.users.map((el) => {
              return (
                <RowTable
                  handleShowModal={handleShowModal}
                  allTeams={allTeams}
                  allPermission={allPermission}
                  handleRefresh={handleRefresh}
                  user={el}
                  key={el._id}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px">
            <li>
              <button
                disabled={page === 1}
                onClick={() => {
                  setPage(page - 1);
                }}
                className={
                  page === 1
                    ? "py-2 px-3 leading-tight  bg-white rounded-l-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-700 dark:text-white"
                    : "py-2 px-3 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
            {[...Array(Math.ceil(users.count / 5))].map((el, idx) => {
              return (
                <li key={idx + 1}>
                  <button
                    disabled={page === idx + 1}
                    onClick={() => {
                      setPage(idx + 1);
                    }}
                    className={
                      page === idx + 1
                        ? "py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-700 dark:text-white"
                        : "py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    }
                  >
                    {idx + 1}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                disabled={page === Math.ceil(users.count / 5)}
                onClick={() => {
                  setPage(page + 1);
                }}
                className={
                  page === Math.ceil(users.count / 5)
                    ? "py-2 px-3 leading-tight  bg-white rounded-r-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-700 dark:text-white"
                    : "py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {showModal && (
        <ModalUser
          consumer={consumer}
          user={userState}
          handleCloseModal={handleCloseModal}
          action={action}
          handleRefresh={handleRefresh}
          allPermission={allPermission}
          allTeams={allTeams}
        />
      )}
      {error ? (
        <DangerAlert handleCloseAlert={handleCloseAlert} msg={errorMsg} />
      ) : (
        ""
      )}
      {success ? <AlertSuccess msg={"user deleted Successfully !"} /> : ""}
    </>
  );
};

export default Users;
