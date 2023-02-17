import React from "react";
import { Icon } from "../../components";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Account() {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <div className="settings-account">
      <p>Account</p>
      {user ? (
        <div className="settings-account-container">
          <div className="settings-account-container-info">
            <p>{user?.username || JSON.parse(user).username}</p>
            <p>{user?.email || JSON.parse(user).email}</p>
          </div>
          <div className="settings-account-container-buttons">
            {/* <div data-tooltip="Change username" className="button">
              <div className="button-wrapper">
                <div className="text">Change username</div>
                <span className="icon">
                  <Icon icon={"edit"} />
                </span>
              </div>
            </div>
            <div data-tooltip="Change password" className="button">
              <div className="button-wrapper">
                <div className="text">Change password</div>
                <span className="icon">
                  <Icon icon={"edit"} />
                </span>
              </div>
            </div> */}
            <div data-tooltip="Log out" className="button" onClick={logout}>
              <div className="button-wrapper">
                <div className="text">Log out</div>
                <span className="icon">
                  <Icon icon={"right-from-bracket"} />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="settings-no-account">
          <p>You are not logged in</p>
          <div className="addcrosshair-account">
            <Link to="/login">Sign in</Link>
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      )}
    </div>
  );
}
