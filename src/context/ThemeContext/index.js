/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { dark, jett, light, plainNight } from "./themes";

const ThemeContext = React.createContext();

function ThemeProvider(props) {
  const themes = ["default", "dark", "jett", "plainNight"];

  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "default"
  );

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      changeTheme(localStorage.getItem("theme"));
    } else {
      setDefault();
    }
  }, []);

  const changeTheme = (theme) => {
    switch (theme) {
      case "light":
        setDefault();
        break;
      case "dark":
        setDark();
        break;
      case "jett":
        setJett();
        break;
      case "plainNight":
        setPlainNight();
        break;
      default:
        setDefault();
    }
  };

  const setDefault = () => {
    localStorage.setItem("theme", "default");
    setTheme("default");
    light();
  };

  const setDark = () => {
    localStorage.setItem("theme", "dark");
    setTheme("dark");
    dark();
  };

  const setJett = () => {
    localStorage.setItem("theme", "jett");
    setTheme("jett");
    jett();
  };

  const setPlainNight = () => {
    localStorage.setItem("theme", "plainNight");
    setTheme("plainNight");
    plainNight();
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themes,
        changeTheme,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };
