import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import "./mainLayout.css";
import Navbar from "./Navbar";

export default function MainLayout() {
  const location = useLocation();
  /*if (!localStorage.getItem("user")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }*/
  return (
    <div className="mainLayout">
      <Navbar />
      <div className="layoutContent">
        <Outlet />
      </div>
    </div>
  );
}
