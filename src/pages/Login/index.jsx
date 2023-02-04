import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Loader } from "../../components";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, setLoading } = useContext(AuthContext);

  const handlerSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    login(email, password);
  };

  return (
    <>
      <Helmet>
        <title>Sign In | MyStats</title>
      </Helmet>
      <div className="login">
        <div className="login_left"></div>
        <div className="login_right">
          <div className="login_right_container">
            <h1>Sign In</h1>
            <form onSubmit={handlerSubmit} className="login_right_form">
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
              <button type="submit" disabled={loading}>
                {loading ? <Loader size={15} /> : "Continue"}
              </button>
            </form>
            <div className="login_more_optiones">
              <Link to="/">
                <span>Forgot Password?</span>
              </Link>
              <Link to="/register">
                {" "}
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
