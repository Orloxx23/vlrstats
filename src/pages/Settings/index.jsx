import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { ThemeContext } from "../../context/ThemeContext";

export default function Settings() {
  const { changeTheme, themes } = useContext(ThemeContext);
  return (
    <>
      <Helmet>
        <title>Settings | MyStas</title>
      </Helmet>

      <div>
        {themes.map((item) => (
          <button key={item} onClick={() => changeTheme(item)}>
            {item}
          </button>
        ))}
      </div>
    </>
  );
}
