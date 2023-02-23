import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Loader } from "../../components";
import "../Login/login.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { Helmet } from "react-helmet-async";
import Page404 from "../Page404";

export default function Register() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setcPassword] = useState("");
  const [check, setCheck] = useState(false);

  const { createAccount, loading, setLoading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const handlerSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== cPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
      });
      setLoading(false);
      return;
    }

    if (!check) {
      toast.error("Please accept terms and conditions", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
      });
      setLoading(false);
      return;
    }

    createAccount(user, email, password);
  };

  if (localStorage.getItem("user")) {
    return <Page404 />;
  } else
    return (
      <>
        <Helmet>
          <title>Sign Up | MyStats</title>
        </Helmet>
        <div className="login">
          <div className="login_left"></div>
          <div className="login_right">
            <div className="login_right_container">
              <h1>Sign Up</h1>
              <form onSubmit={handlerSubmit} className="login_right_form">
                <input
                  type="text"
                  placeholder="Username"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  disabled={loading}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={cPassword}
                  disabled={loading}
                  onChange={(e) => setcPassword(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? <Loader size={15} /> : "Continue"}
                </button>
              </form>
              <div className="login_more_optiones">
                <div className="left_options">
                  <label className="checkBox">
                    <input
                      id="ch1"
                      type="checkbox"
                      checked={check}
                      onChange={() => setCheck(!check)}
                    />
                    <div className="transition"></div>
                  </label>
                  <span>Accept terms and conditions</span>
                </div>

                <Link to="/login">
                  {" "}
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
