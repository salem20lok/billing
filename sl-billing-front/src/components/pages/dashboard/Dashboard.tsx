import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { saveUser } from "../../../store/UserSlice/Slice";
import { debounce } from "lodash";
import { identificationAction } from "../../../actions/identification/action";
import { saveProfilePayload } from "../../../store/UserSlice/type";

const Users = React.lazy(() => import("./pages/users/Users"));
const Team = React.lazy(() => import("./pages/team/Team"));
const Plan = React.lazy(() => import("./pages/plan/Plan"));
const Permission = React.lazy(() => import("./pages/permission/Permission"));
const Home = React.lazy(() => import("./pages/home/Home"));
const Feature = React.lazy(() => import("./pages/feature/Feature"));
const NavBar = React.lazy(() => import("../../parts/Nav/NavBar"));
const SideBar = React.lazy(() => import("../../parts/sideBar/SideBar"));

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [consumer, setConsumer] = useState<saveProfilePayload>({
    user: {
      role: "",
      lastName: "",
      firstName: "",
      email: "",
    },
    permission: [],
  });

  const identification = () => {
    if (localStorage.getItem("accessToken") !== null) {
      identificationAction((res, data) => {
        if (res) {
          setConsumer({ user: data.user, permission: data.permission });
          dispatch(saveUser({ user: data.user, permission: data.permission }));
        } else {
          navigate("/login");
        }
      });
    } else {
      navigate("/login");
    }
  };

  const debounceAuth = debounce(() => {
    identification();
  }, 0);

  useEffect(() => {
    debounceAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex w-screen h-screen text-gray-700">
        <SideBar />
        <div className="flex flex-col flex-grow">
          <NavBar />
          <div className="flex-grow p-6 overflow-auto bg-gray-200">
            <div className="grid grid-cols-1">
              <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<Feature />} path="feature" />
                <Route element={<Permission />} path="permission" />
                <Route element={<Plan />} path="plan" />
                <Route element={<Team />} path="team" />
                <Route element={<Users consumer={consumer} />} path="users" />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
