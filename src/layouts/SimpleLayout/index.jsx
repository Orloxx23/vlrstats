import React from "react";
import { Outlet } from "react-router-dom";

export default function SimpleLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
