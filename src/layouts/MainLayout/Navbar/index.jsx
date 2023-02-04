/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { menuData, menuOptions } from "./config";

import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__menu">
        {menuData.map((item) => (
          <NavbarItem
            key={item.title}
            icon={item.icon}
            type={item.type}
            path={item.path}
          />
        ))}
      </div>
      <div className="navbar__user">
        {menuOptions.map((item) => (
          <NavbarItem
            key={item.title}
            icon={item.icon}
            type={item.type}
            path={item.path}
          />
        ))}
      </div>
    </nav>
  );
}

export function NavbarItem({ icon, path }) {
  const [active, setActive] = React.useState(false);

  let location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setActive(location.pathname === path);
  }, [location]);

  const goTo = () => navigate(path);

  return (
    <div
      className={
        active
          ? "navbar__menu__item navbar__menu__item--active"
          : "navbar__menu__item"
      }
      onClick={goTo}
    >
      {icon}
    </div>
  );
}
