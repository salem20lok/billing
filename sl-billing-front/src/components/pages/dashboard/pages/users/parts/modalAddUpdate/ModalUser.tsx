import { useEffect, useState } from "react";
import { Permission } from "../../../../../../../@Types/Permission";
import User from "../../../../../../../@Types/User";
import { isName } from "../../../../../../../utils/validation/name";
import { isEmail } from "../../../../../../../utils/validation/email";
import { RoleEnumFront } from "../../../../../../../@Types/RoleEnum";
import { PermissionEnum } from "../../../../../../../@Types/PermissionEnumFront";
import { PermissionNameEnum } from "../../../../../../../@Types/PermissionNameEnumFront";
import { addUser, updateUser } from "../../../../../../../actions/users/action";
import PermissionList from "../permissionList/PermissionList";
import { getUserPermissionAction } from "../../../../../../../actions/user-permission/action";
import { UserPermission } from "../../../../../../../@Types/UserPermission";
import { debounce } from "lodash";
import { isPassword } from "../../../../../../../utils/validation/passowrd";
import UploadImage from "../../../../../../parts/uplad image/UploadImage";
import { TeamType } from "../../../../../../../@Types/Team";
import { getTeamUserByUser } from "../../../../../../../actions/team/action";
import { saveProfilePayload } from "../../../../../../../store/UserSlice/type";

interface UpdateUserPropsInterface {
  action: string;
  user?: User;
  handleRefresh: Function;
  allPermission: Permission[];
  allTeams: TeamType[];
  handleCloseModal: Function;
  consumer: saveProfilePayload;
}

const roles = [
  RoleEnumFront.User,
  RoleEnumFront.Admin,
  RoleEnumFront.SuperAdmin,
];

const ModalUser = (props: UpdateUserPropsInterface) => {
  const {
    handleRefresh,
    user,
    allPermission,
    action,
    allTeams,
    handleCloseModal,
    consumer,
  } = props;

  const [allTeamsState, setTeamsState] = useState<TeamType[]>(allTeams);
  const [showSelectMulti, setShowSelectMulti] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [showPasswordConfirmed, setShowPasswordConfirmed] =
    useState<boolean>(false);

  const [query, setQuery] = useState<User>({
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    email: user ? user.email : "",
    password: "",
    confirmePassword: "",
    role: user ? user.role : RoleEnumFront.User,
    permission: [],
    name: action === "add" ? PermissionNameEnum.Add : PermissionNameEnum.Update,
    management: PermissionEnum.User,
    _id: user ? user._id : "",
    avatar: user ? user.avatar : "",
    teams: [],
    teamsAdd: [],
    teamsDelete: [],
    permissionDelete: [],
    permissionAdd: [],
  });

  const [queryError, setQueryError] = useState({
    passwordError: false,
    passwordConfirmedError: false,
    firstNameError: isName(user ? user.firstName : ""),
    lastNameError: isName(user ? user.lastName : ""),
    emailError: isEmail(user ? user.email : ""),
  });

  const [userPermission, setUserPermission] = useState<Permission[]>([]);
  const [userTeams, setUserTeam] = useState<string[]>([]);

  /**
   * @description get Permission user
   * @returns {userPermission[]} resultat , save to setPermission for update ,  setUserPermission for oldPermission
   */

  const getUserPermission = () => {
    getUserPermissionAction(
      user && user._id ? user._id : "",
      (userPermission) => {
        setUserPermission(
          userPermission.map((el: UserPermission) => {
            return el.permission;
          })
        );
        getTeamUserByUser(user?._id || "", (data) => {
          setUserTeam(data);
          setQuery({
            ...query,
            teams: data,
            permission: userPermission.map((el: UserPermission) => {
              return el.permission._id;
            }),
          });
        });
      }
    );
  };

  const handlePermission = (payload: string[]) => {
    let permissionDelete: string[] = [];
    userPermission.forEach((el) => {
      if (!payload.includes(el._id)) {
        permissionDelete = [...permissionDelete, el._id];
      }
    });

    let permissionAdd: string[] = [];
    payload.forEach((el) => {
      if (![...userPermission.map((el) => el._id)].includes(el)) {
        permissionAdd = [...permissionAdd, el];
      }
    });

    setQuery({
      ...query,
      permission: payload,
      permissionAdd: permissionAdd,
      permissionDelete: permissionDelete,
    });
  };

  const UpdateUser = () => {
    updateUser(query, (res, msg) => {
      handleRefresh(res, msg);
    });
  };

  const uploadAvatar = (payload: string) => {
    setQuery({ ...query, avatar: payload });
  };

  const handleAdduser = () => {
    addUser(query, (res, msg) => {
      handleRefresh(res, msg);
    });
  };

  const debounceUserPermission = debounce(() => {
    getUserPermission();
  }, 0);

  const debounceGetTeamUserByUser = debounce(() => {
    getTeamUserByUser(user?._id || "", (data) => {
      setUserTeam(data);
      setQuery({
        ...query,
        teams: data,
      });
    });
  }, 0);

  const handleTeamSelected = (payload: string) => {
    let teamPayload: string[] = [];

    if (payload !== "") {
      query.teams?.includes(payload)
        ? (teamPayload = query.teams?.filter((el) => el !== payload))
        : (teamPayload = [...(query.teams || []), payload]);
    }

    let teamDelete: string[] = [];
    userTeams.forEach((el) => {
      if (!teamPayload.includes(el)) {
        teamDelete = [...teamDelete, el];
      }
    });

    let teamAdd: string[] = [];
    teamPayload.forEach((el) => {
      if (!userTeams.includes(el)) {
        teamAdd = [...teamAdd, el];
      }
    });

    setQuery({
      ...query,
      teams: teamPayload,
      teamsAdd: teamAdd,
      teamsDelete: teamDelete,
    });
  };

  const debounceSearch = debounce((payload: string) => {
    setTeamsState(allTeams.filter((el) => el.teamName.includes(payload)));
  }, 1000);

  useEffect(() => {
    if (
      action === "update" &&
      consumer.user.role === RoleEnumFront.SuperAdmin
    ) {
      debounceUserPermission();
    } else if (
      action === "update" &&
      consumer.permission.some((el) => {
        return (
          el.permission.management === PermissionEnum.Team &&
          el.permission.name === PermissionNameEnum.View
        );
      })
    ) {
      debounceGetTeamUserByUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              Update User
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
          <div className="p-6 space-y-6">
            <form autoComplete="off">
              <div className="grid md:grid-cols-2 md:gap-6">
                <UploadImage
                  uploadAvatar={uploadAvatar}
                  avatar={query.avatar ? query.avatar : "/images/avatar.png"}
                />
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    name="floating_first_name"
                    id="floating_first_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={query.firstName}
                    onChange={(e) => {
                      setQuery({ ...query, firstName: e.target.value });
                      setQueryError({
                        ...queryError,
                        firstNameError: isName(e.target.value),
                      });
                    }}
                  />
                  <label
                    htmlFor="floating_first_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    First name
                  </label>
                  {queryError.firstNameError || query.firstName === "" ? (
                    ""
                  ) : (
                    <span className="text-red-500 text-xs p-1">
                      please check correct firstName !
                    </span>
                  )}
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    name="floating_last_name"
                    id="floating_last_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={query.lastName}
                    onChange={(e) => {
                      setQuery({ ...query, lastName: e.target.value });
                      setQueryError({
                        ...queryError,
                        lastNameError: isName(e.target.value),
                      });
                    }}
                  />
                  <label
                    htmlFor="floating_last_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Last name
                  </label>
                  {queryError.lastNameError || query.lastName === "" ? (
                    ""
                  ) : (
                    <span className="text-red-500 text-xs p-1">
                      please check correct lastName !
                    </span>
                  )}
                </div>
              </div>

              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="email"
                  name="floating_email"
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={query.email}
                  onChange={(e) => {
                    setQuery({ ...query, email: e.target.value });
                    setQueryError({
                      ...queryError,
                      emailError: isEmail(e.target.value),
                    });
                  }}
                />
                <label
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
                {queryError.emailError || query.email === "" ? (
                  ""
                ) : (
                  <span className="text-red-500 text-xs p-1">
                    please check correct email !
                  </span>
                )}
              </div>

              {action === "add" && (
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 mb-6 w-full group">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={query.password}
                        onChange={(e) => {
                          setQuery({ ...query, password: e.target.value });
                          setQueryError({
                            ...queryError,
                            passwordError:
                              isPassword(e.target.value) &&
                              query.password !== "",
                          });
                        }}
                        name="floating_password"
                        id="floating_password"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 inline-flex items-center right-4 cursor-pointer"
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </span>
                      <label
                        htmlFor="floating_password"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        password
                      </label>
                    </div>
                    {queryError.passwordError || query.password === "" ? (
                      ""
                    ) : (
                      <span className="text-red-500 text-xs p-1">
                        please check correct password !
                      </span>
                    )}
                  </div>

                  <div className="relative z-0 mb-6 w-full group">
                    <div className="relative">
                      <input
                        type={showPasswordConfirmed ? "text" : "password"}
                        value={query.confirmePassword}
                        onChange={(e) => {
                          setQuery({
                            ...query,
                            confirmePassword: e.target.value,
                          });
                          setQueryError({
                            ...queryError,
                            passwordConfirmedError:
                              isPassword(e.target.value) &&
                              query.confirmePassword !== "",
                          });
                        }}
                        name="floating_confirm_password"
                        id="floating_confirm_password"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                      />
                      <span
                        onClick={() =>
                          setShowPasswordConfirmed(!showPasswordConfirmed)
                        }
                        className="absolute inset-y-0 inline-flex items-center right-4 cursor-pointer"
                      >
                        {showPasswordConfirmed ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </span>
                      <label
                        htmlFor="floating_confirm_password"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Confirm password
                      </label>
                    </div>
                    {query.confirmePassword === "" ||
                    (query.confirmePassword === query.password &&
                      queryError.passwordConfirmedError) ? (
                      ""
                    ) : (
                      <span className="text-red-500 text-xs p-1">
                        please check correct ConfirmePassword !
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Role
                  </label>
                  <select
                    value={query.role}
                    onChange={(e) =>
                      setQuery({ ...query, role: e.target.value })
                    }
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option>Choose a Role</option>
                    {roles.map((el, idx) => {
                      return (
                        <option key={idx} value={el}>
                          {el}
                        </option>
                      );
                    })}
                  </select>
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
                  <div className="relative z-0 mb-6 w-full group">
                    <button
                      id="dropdownSearchButton"
                      data-dropdown-toggle="dropdownSearch"
                      className="flex justify-between py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      type="button"
                      onClick={() => setShowSelectMulti(!showSelectMulti)}
                    >
                      Users Team
                      <svg
                        className="ml-2 w-4 h-4"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {showSelectMulti && (
                      <>
                        <div
                          style={{ zIndex: 999 }}
                          onClick={() => setShowSelectMulti(false)}
                          className="fixed w-full h-full  top-0 left-0 bg-black bg-opacity-0 overflow-y-auto fixed z-30 md:inset-0 h-modal md:h-full"
                        />
                        <div
                          style={{ position: "absolute", zIndex: 1000 }}
                          id="dropdownSearch"
                          className="w-full  bg-white rounded shadow dark:bg-gray-900 "
                        >
                          <div className="p-3">
                            <label
                              htmlFor="input-group-search"
                              className="sr-only"
                            >
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
                                onChange={(e) => {
                                  debounceSearch(e.target.value);
                                }}
                                type="text"
                                id="input-group-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search user"
                              />
                            </div>
                          </div>
                          <ul
                            className="overflow-y-auto px-3 pb-3 max-h-40 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownSearchButton"
                          >
                            {allTeamsState.map((el) => {
                              return (
                                <li key={el._id}>
                                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <input
                                      onChange={() => {
                                        handleTeamSelected(el._id || "");
                                      }}
                                      checked={query.teams?.includes(
                                        el._id || ""
                                      )}
                                      id={el._id}
                                      type="checkbox"
                                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                      htmlFor={el._id}
                                      className=" flex  ml-2 w-full text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                    >
                                      <div className="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2 w-4 h-4 mt-1 rounded-full ">
                                        <img
                                          className="rounded-full"
                                          alt="A"
                                          src={
                                            el.avatar?.length
                                              ? el.avatar
                                              : "/images/team.png"
                                          }
                                        />
                                      </div>
                                      {el.teamName}
                                    </label>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                          <span
                            onClick={() => {
                              setQuery({ ...query, teams: [] });
                              handleTeamSelected("");
                            }}
                            className="flex  cursor-pointer items-center p-3 text-sm font-medium text-red-600 bg-gray-50 border-t border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-600 dark:text-red-500 "
                          >
                            <svg
                              className="mr-1 w-5 h-5"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
                            </svg>
                            Delete all user
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              {consumer.user.role === RoleEnumFront.SuperAdmin &&
              query.role === RoleEnumFront.Admin ? (
                <PermissionList
                  handlePermissionModal={handlePermission}
                  allPermission={allPermission}
                  permission={query.permission ? query.permission : []}
                />
              ) : (
                ""
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
              onClick={action === "update" ? UpdateUser : handleAdduser}
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

export default ModalUser;
