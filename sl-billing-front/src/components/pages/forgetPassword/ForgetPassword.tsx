import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { isEmail } from "../../../utils/validation/email";
import DangerAlert from "../../../utils/dangerAlert/DangerAlert";
import AlertSuccess from "../../../utils/alertSuccess/AlertSuccess";
import { debounce } from "lodash";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const identification = () => {
    if (localStorage.getItem("accessToken") !== null) {
      axios
        .get(process.env.REACT_APP_API_URL + "/user/identification", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        })
        .then(() => {
          navigate("/");
        })
        .catch((e) => {
          console.log(e.response.data.message);
        });
    }
  };

  const debounceAuth = debounce(() => {
    identification();
  }, 0);

  useEffect(() => {
    debounceAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleForgetPassword = () => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "/auth/forget-password",
        {},
        { params: { email: email } }
      )
      .then(() => {
        setTimeout(() => {
          setSuccess(false);
          navigate("/login");
        }, 500);
        setSuccess(true);
      })
      .catch((e) => {
        setErrorMsg(e.response.data.message);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 860);
        setError(true);
      });
  };

  const handleCloseAlert = () => {
    setError(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:w-2/3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <Link
            className="text-sm text-gray-500 flex justify-items-center "
            to="/login"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Login
          </Link>
          <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" mx-auto mb-2 h-20 w-20 p-5 rounded-full bg-blue-500 text-white "
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z"
                  clipRule="evenodd"
                />
              </svg>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Forget Password !
              </h1>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="max-w-md mx-auto mt-8 mb-0 space-y-4"
            >
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>

                <div className="relative">
                  <input
                    type="email"
                    className="w-full p-4 pr-12 text-sm border border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(isEmail(e.target.value) && email !== "");
                    }}
                  />
                  <span className="absolute inset-y-0 inline-flex items-center right-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                {emailError || email === "" ? (
                  ""
                ) : (
                  <span className="text-red-500 text-xs p-1">
                    please check correct email !
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center">
                <button
                  disabled={!emailError || email === ""}
                  type="submit"
                  className="inline-block px-5 w-full py-3  text-sm font-medium text-white bg-blue-500 rounded-lg"
                  onClick={handleForgetPassword}
                >
                  change password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {error ? (
        <DangerAlert handleCloseAlert={handleCloseAlert} msg={errorMsg} />
      ) : (
        ""
      )}
      {success ? <AlertSuccess msg="email send Successfully !" /> : ""}
    </div>
  );
};

export default ForgetPassword;
