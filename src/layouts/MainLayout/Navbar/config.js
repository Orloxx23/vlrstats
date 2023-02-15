import { Icon } from "../../../components";

const icon = (icon, type) => <Icon icon={icon} type={type} />;

const menuData = [
  {
    title: "home",
    path: "/",
    icon: icon("home", "solid"),
  },
  {
    title: "news",
    path: "/news",
    icon: icon("newspaper"),
  },
  /*{
    title: "crosshairs",
    path: "/crosshairs",
    icon: icon("crosshairs"),
  },
  {
    title: "leaderboard",
    path: "/leaderboard",
    icon: icon("ranking-star"),
  },
  {
    title: "tournaments",
    path: "/tournaments",
    icon: icon("trophy"),
  }, */
];

const menuOptions = [
  {
    title: "settings",
    path: "/settings",
    icon: icon("gear", "solid"),
  },
/*  {
    title: "account",
    path: "/account",
    icon: icon("user"),
  },*/
];

export { menuData, menuOptions };
