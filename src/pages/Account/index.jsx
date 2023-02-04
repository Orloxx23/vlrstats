import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";

export default function Account() {
  const { logout } = useContext(AuthContext);
  return (
    <>
      <Helmet>
        <title>Account | MyStas</title>
      </Helmet>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
}
