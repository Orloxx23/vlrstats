import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { ThemeContext } from "../../context/ThemeContext";
import "./settings.css";
import ThemesButton from "./ThemesButton";

import './settingsButtons.css'
import Account from "./Account";

export default function Settings() {
  const { changeTheme, themes } = useContext(ThemeContext);
  return (
    <>
      <Helmet>
        <title>Settings | MyStas</title>
      </Helmet>

      <div className="settings-first-container">
        <div className="themes-container">
          <p>Theme</p>
          <div className="themes-buttons">
            {themes.map((item) => (
              <ThemesButton
                key={item}
                action={() => changeTheme(item)}
                name={item}
              />
            ))}
          </div>
        </div>
        <Account />
      </div>
    </>
  );
}
