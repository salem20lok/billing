import React, { Suspense } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

const Dashboard = React.lazy(
  () => import("../components/pages/dashboard/Dashboard")
);
const Login = React.lazy(() => import("../components/pages/login/Login"));
const ChangePassword = React.lazy(
  () => import("../components/pages/changePassword/ChangePassword")
);
const ForgetPassword = React.lazy(
  () => import("../components/pages/forgetPassword/ForgetPassword")
);

function App() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/*" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
    </Suspense>
  );
}

export default App;
