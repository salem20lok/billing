import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isEmail } from "../../../utils/validation/email";
import { isPassword } from "../../../utils/validation/passowrd";
import DangerAlert from "../../../utils/dangerAlert/DangerAlert";
import { debounce } from "lodash";

const Login = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);
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

  const handleLogin = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/auth/login", {
        email: email,
        password: password,
      })
      .then(({ data }) => {
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/");
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
          <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" mx-auto mb-2 h-20 w-20 p-5 rounded-full bg-blue-500 text-white "
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
              </svg>
              <h1 className="text-2xl font-bold sm:text-3xl">Sign In !</h1>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="max-w-md mx-auto mt-8 mb-0 space-y-4"
              autoComplete="on"
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

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-4 pr-12 text-sm border border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(
                        isPassword(e.target.value) && password !== ""
                      );
                    }}
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
                </div>
                {passwordError || password === "" ? (
                  ""
                ) : (
                  <span className="text-red-500 text-xs p-1">
                    please check correct password !
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <Link className="text-sm text-gray-500" to="/forget-password">
                  Forget Password?
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <button
                  disabled={
                    (!emailError && !passwordError) ||
                    password === "" ||
                    email === ""
                  }
                  type="submit"
                  className="inline-block px-5 w-full py-3  text-sm font-medium text-white bg-blue-500 rounded-lg"
                  onClick={handleLogin}
                >
                  Sign in
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
    </div>
  );
};

export default Login;
