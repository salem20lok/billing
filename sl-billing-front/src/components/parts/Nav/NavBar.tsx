import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { removeUser } from "../../../store/UserSlice/Slice";

const navigation = [
  {
    name: "view profile",
    href: "/profile",
    icon: (
      <svg
        className="w-5 h-5 mx-1"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.8199 22H10.1799C9.71003 22 9.30347 21.673 9.20292 21.214L8.79592 19.33C8.25297 19.0921 7.73814 18.7946 7.26092 18.443L5.42392 19.028C4.97592 19.1709 4.48891 18.9823 4.25392 18.575L2.42992 15.424C2.19751 15.0165 2.27758 14.5025 2.62292 14.185L4.04792 12.885C3.98312 12.2961 3.98312 11.7019 4.04792 11.113L2.62292 9.816C2.27707 9.49837 2.19697 8.98372 2.42992 8.576L4.24992 5.423C4.48491 5.0157 4.97192 4.82714 5.41992 4.97L7.25692 5.555C7.50098 5.37416 7.75505 5.20722 8.01792 5.055C8.27026 4.91269 8.52995 4.78385 8.79592 4.669L9.20392 2.787C9.30399 2.32797 9.71011 2.00049 10.1799 2H13.8199C14.2897 2.00049 14.6958 2.32797 14.7959 2.787L15.2079 4.67C15.4887 4.79352 15.7622 4.93308 16.0269 5.088C16.2739 5.23081 16.5126 5.38739 16.7419 5.557L18.5799 4.972C19.0276 4.82967 19.514 5.01816 19.7489 5.425L21.5689 8.578C21.8013 8.98548 21.7213 9.49951 21.3759 9.817L19.9509 11.117C20.0157 11.7059 20.0157 12.3001 19.9509 12.889L21.3759 14.189C21.7213 14.5065 21.8013 15.0205 21.5689 15.428L19.7489 18.581C19.514 18.9878 19.0276 19.1763 18.5799 19.034L16.7419 18.449C16.5093 18.6203 16.2677 18.7789 16.0179 18.924C15.7557 19.0759 15.4853 19.2131 15.2079 19.335L14.7959 21.214C14.6954 21.6726 14.2894 21.9996 13.8199 22ZM7.61992 16.229L8.43992 16.829C8.62477 16.9652 8.81743 17.0904 9.01692 17.204C9.20462 17.3127 9.39788 17.4115 9.59592 17.5L10.5289 17.909L10.9859 20H13.0159L13.4729 17.908L14.4059 17.499C14.8132 17.3194 15.1998 17.0961 15.5589 16.833L16.3799 16.233L18.4209 16.883L19.4359 15.125L17.8529 13.682L17.9649 12.67C18.0141 12.2274 18.0141 11.7806 17.9649 11.338L17.8529 10.326L19.4369 8.88L18.4209 7.121L16.3799 7.771L15.5589 7.171C15.1997 6.90671 14.8132 6.68175 14.4059 6.5L13.4729 6.091L13.0159 4H10.9859L10.5269 6.092L9.59592 6.5C9.39772 6.58704 9.20444 6.68486 9.01692 6.793C8.81866 6.90633 8.62701 7.03086 8.44292 7.166L7.62192 7.766L5.58192 7.116L4.56492 8.88L6.14792 10.321L6.03592 11.334C5.98672 11.7766 5.98672 12.2234 6.03592 12.666L6.14792 13.678L4.56492 15.121L5.57992 16.879L7.61992 16.229ZM11.9959 16C9.78678 16 7.99592 14.2091 7.99592 12C7.99592 9.79086 9.78678 8 11.9959 8C14.2051 8 15.9959 9.79086 15.9959 12C15.9932 14.208 14.2039 15.9972 11.9959 16ZM11.9959 10C10.9033 10.0011 10.0138 10.8788 9.99815 11.9713C9.98249 13.0638 10.8465 13.9667 11.9386 13.9991C13.0307 14.0315 13.9468 13.1815 13.9959 12.09V12.49V12C13.9959 10.8954 13.1005 10 11.9959 10Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/settings",
    icon: (
      <svg
        className="w-5 h-5 mx-1"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 19H3C1.89543 19 1 18.1046 1 17V16H3V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V16H23V17C23 18.1046 22.1046 19 21 19ZM5 7V16H19V7H5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dropdown, setDropdown] = useState<boolean>(false);

  const user = useSelector((state: RootState) => {
    return state.user.user;
  });

  const handleSignOut = () => {
    setDropdown(false);
    localStorage.removeItem("accessToken");
    dispatch(removeUser());
    navigate("/login");
  };

  return (
    <>
      {dropdown ? (
        <div
          onClick={() => setDropdown(false)}
          id="popup-modal"
          tabIndex={-1}
          className=" bg-black bg-opacity-10 overflow-y-auto fixed top-0  left-0 z-30 md:inset-0 h-modal md:h-full"
        />
      ) : (
        ""
      )}
      <div className="flex z-30 items-center flex-shrink-0 h-16  border-b border-gray-300">
        <div className="flex  items-center h-20 px-6 sm:px-10 bg-gray-800  w-full text-white ">
          <div className="px-5   xl:px-12 py-6 flex w-full items-center justify-between ">
            <span className="text-3xl font-bold font-heading">
              {/* <img class="h-9" src="logo.png" alt="logo"> */}
              {user.firstName + " " + user.lastName}
            </span>
            <div className="flex items-center space-x-5 cursor-pointer  ">
              <span className="hover:text-gray-200 animate-pulse hidden ">
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
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
              </span>

              <span className="flex items-center hover:text-gray-200 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="flex absolute -mt-5 ml-4">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </span>
              {/* avatar */}
              <div className="relative inline-block ">
                {/* Dropdown toggle button */}
                <div
                  onClick={() => setDropdown(!dropdown)}
                  className="cursor-pointer relative z-10 flex items-center p-2 text-sm text-gray-600 bg-white border border-transparent rounded-md focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring dark:text-white dark:bg-gray-800 focus:outline-none"
                >
                  <div className="flex items-center justify-center w-10 h-10  overflow-hidden rounded-full">
                    <img
                      src={
                        user.avatar === undefined ||
                        user.avatar === "" ||
                        user.avatar === null
                          ? "/images/avatar.png"
                          : user.avatar
                      }
                      alt={user.firstName}
                    />
                  </div>
                  <svg
                    className="w-5 h-5 mx-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                {/* Dropdown menu */}
                {dropdown ? (
                  <div className="absolute right-0 z-20 w-56 py-2 mt-1 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800">
                    <span className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                      <img
                        className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                        src={
                          user.avatar === undefined ||
                          user.avatar === "" ||
                          user.avatar === null
                            ? "/images/avatar.png"
                            : user.avatar
                        }
                        alt="jane avatar"
                      />
                      <div className="mx-1">
                        <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {user.firstName + " " + user.lastName}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </span>
                    <hr className="border-gray-200 dark:border-gray-700 " />
                    {navigation.map((el, idx) => {
                      return (
                        <Link
                          key={idx}
                          to={el.href}
                          className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {el.icon}
                          <span className="mx-1">{el.name}</span>
                        </Link>
                      );
                    })}
                    <hr className="border-gray-200 dark:border-gray-700 " />
                    <span
                      onClick={handleSignOut}
                      className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-red-400  "
                    >
                      <svg
                        className="w-5 h-5 mx-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="mx-1 ">Sign Out</span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {/* avatar */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
