import { useEffect, useState } from "react";
import { TeamType } from "../../../../../../../@Types/Team";
import { isName } from "../../../../../../../utils/validation/name";
import UploadImage from "../../../../../../parts/uplad image/UploadImage";
import User from "../../../../../../../@Types/User";
import { debounce } from "lodash";
import { getTeamUserAction } from "../../../../../../../actions/team-user/action";
import { PermissionNameEnum } from "../../../../../../../@Types/PermissionNameEnumFront";
import { PermissionEnum } from "../../../../../../../@Types/PermissionEnumFront";
import { addTeam, updateTeam } from "../../../../../../../actions/team/action";
import { saveProfilePayload } from "../../../../../../../store/UserSlice/type";
import { RoleEnumFront } from "../../../../../../../@Types/RoleEnum";
import { PlanType } from "../../../../../../../@Types/PlanType";
import { getFeaturesByPlan } from "../../../../../../../actions/feature/action";
import { getTeamFeaturesByTeam } from "../../../../../../../actions/team-feature/action";
import FeaturesTeam from "../features/Features";

interface TeamModalInterfaceProps {
  action: string;
  allUser: User[];
  handleCloseModal: Function;
  team?: TeamType;
  handleRefresh: Function;
  consumer: saveProfilePayload;
  allPlan: PlanType[];
}

const TeamModal = (props: TeamModalInterfaceProps) => {
  const {
    action,
    allUser,
    handleCloseModal,
    team,
    handleRefresh,
    consumer,
    allPlan,
  } = props;

  const [showSelectMulti, setShowSelectMulti] = useState<boolean>(false);
  const [usersState, setUsersState] = useState<User[]>(allUser);
  const [teamUser, setTeamUser] = useState<string[]>([]);

  const [query, setQuery] = useState<TeamType>({
    teamName: action === "update" && team ? team.teamName : "",
    avatar: action === "update" && team ? team.avatar : "",
    plan: action === "update" && team ? team.plan : "plan",
    users: [],
    name: action === "add" ? PermissionNameEnum.Add : PermissionNameEnum.Update,
    management: PermissionEnum.Team,
    _id: action === "update" && team ? team._id : "",
    teamUserAdd: [],
    teamUserDelete: [],
    addFeature: [],
    deleteFeature: [],
  });
  const [queryError, setQueryError] = useState({
    teamName: true,
    avatar: true,
    plan: true,
  });

  const uploadAvatar = (payload: string) => {
    setQuery({ ...query, avatar: payload });
  };

  const handleUsers = (payload: string) => {
    let users: string[] = [];
    if (payload !== "") {
      if (query.users) {
        query.users?.includes(payload)
          ? (users = query.users.filter((el) => el !== payload))
          : (users = [...query.users, payload]);
      }
    }

    let teamUserAdd: string[] = [];
    users.forEach((el) => {
      if (!teamUser.includes(el)) {
        teamUserAdd = [...teamUserAdd, el];
      }
    });

    let teamUserDelete: string[] = [];
    teamUser.forEach((el) => {
      if (!users.includes(el)) {
        teamUserDelete = [...teamUserDelete, el];
      }
    });

    setQuery({
      ...query,
      users: users,
      teamUserAdd: teamUserAdd,
      teamUserDelete: teamUserDelete,
    });
  };

  const debounceSearch = debounce((payload: string) => {
    setUsersState(allUser.filter((el) => el.firstName.includes(payload)));
  }, 1000);

  const handelAdd = () => {
    addTeam(query, (res, msg) => {
      handleRefresh(res, msg);
    });
  };

  const handleUpdate = () => {
    updateTeam(query, (res, msg) => {
      handleRefresh(res, msg);
      if (!res) {
        setQuery({ ...query, _id: team?._id });
      }
    });
  };

  const [featureTeam, setFeatureTeam] = useState<string[]>([]);
  const [featurePlan, setFeaturePlan] = useState<string[]>([]);

  const handleExtraFeature = debounce((plan: string) => {
    let users: string[] = [];
    if (action === "update") {
      getTeamUserAction(team?._id || "", (data) => {
        setTeamUser(data);
        users = data;
      });
    }

    getFeaturesByPlan(plan, (planFeature) => {
      if (action === "update") {
        getTeamFeaturesByTeam(team?._id || "", (teamFeature) => {
          setFeatureTeam([...teamFeature, ...planFeature]);
          setQuery({
            ...query,
            plan: plan,
            feature: [...teamFeature, ...planFeature],
            users: users,
          });
        });
      } else {
        setQuery({
          ...query,
          plan: plan,
          feature: [...planFeature],
          users: users,
        });
      }
      setFeaturePlan(planFeature);
    });
  });

  const handleDeleteAllFeature = () => {
    let feature: string[] = [];

    let deleteFeature: string[] = [];
    featureTeam.forEach((el) => {
      if (!feature.includes(el)) {
        deleteFeature = [...deleteFeature, el];
      }
    });

    let addFeature: string[] = [];
    feature.forEach((el) => {
      if (!featureTeam.includes(el)) {
        addFeature = [...addFeature, el];
      }
    });

    setQuery({
      ...query,
      feature: feature,
      addFeature: addFeature,
      deleteFeature: deleteFeature,
    });
    console.log(addFeature, deleteFeature);
  };

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
    featureTeam.forEach((el) => {
      if (!feature.includes(el)) {
        deleteFeature = [...deleteFeature, el];
      }
    });

    let addFeature: string[] = [];
    feature.forEach((el) => {
      if (!featureTeam.includes(el)) {
        addFeature = [...addFeature, el];
      }
    });

    setQuery({
      ...query,
      feature: feature,
      addFeature: addFeature,
      deleteFeature: deleteFeature,
    });
    console.log(addFeature, deleteFeature);
  };

  useEffect(() => {
    if (action === "update") {
      handleExtraFeature(team?.plan || "");
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
              {action} team
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
          <div className="p-6 space-y-6 h-60 ">
            <form autoComplete="off">
              <div className="grid md:grid-cols-2 md:gap-6">
                <UploadImage
                  uploadAvatar={uploadAvatar}
                  avatar={query.avatar ? query.avatar : "/images/team.png"}
                />

                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="email"
                    name="floating_email"
                    id="floating_email"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={query.teamName}
                    onChange={(e) => {
                      setQuery({ ...query, teamName: e.target.value });
                      setQueryError({
                        ...queryError,
                        teamName: isName(e.target.value),
                      });
                    }}
                  />
                  <label
                    htmlFor="floating_email"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Team Name
                  </label>
                  {queryError.teamName || query.teamName === "" ? (
                    ""
                  ) : (
                    <span className="text-red-500 text-xs p-1">
                      please check correct Team Name !
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <label
                    htmlFor="underline_select_team"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Plan
                  </label>
                  <select
                    onChange={(e) => {
                      handleExtraFeature(e.target.value);
                    }}
                    value={query.plan}
                    id="underline_select_team"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option>Choose a plan</option>
                    {allPlan.map((el) => {
                      return (
                        <option key={el._id} value={el._id}>
                          {el.planName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {(consumer.user.role === RoleEnumFront.SuperAdmin ||
                  (consumer.user.role === RoleEnumFront.Admin &&
                    consumer.permission.some((el) => {
                      return (
                        el.permission.management === PermissionEnum.User &&
                        el.permission.name === PermissionNameEnum.Update
                      );
                    }) &&
                    action === "update") ||
                  (consumer.permission.some((el) => {
                    return (
                      el.permission.management === PermissionEnum.User &&
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
                            {usersState.map((el) => {
                              return (
                                <li key={el._id}>
                                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <input
                                      onChange={() => {
                                        handleUsers(el._id || "");
                                      }}
                                      checked={query.users?.includes(
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
                                              : "/images/avatar.png"
                                          }
                                        />
                                      </div>
                                      {el.firstName + " " + el.lastName}
                                    </label>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                          <span
                            onClick={() => {
                              setQuery({ ...query, users: [] });
                              handleUsers("");
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
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <FeaturesTeam
                    featurePlan={featurePlan}
                    query={query}
                    handleFeature={handleFeature}
                    handleDeleteAllFeature={handleDeleteAllFeature}
                  />
                </div>
              </div>
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
                action === "add" ? handelAdd() : handleUpdate();
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

export default TeamModal;
