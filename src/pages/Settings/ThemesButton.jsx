import React from "react";

export default function Themes({ name, action }) {
  const [theme, setTheme] = React.useState({color1: "#FD4556", color2: "#FFF5F5"});

  React.useEffect(() => {
    switch (name) {
      case "light":
        setTheme({
          color1: "#FD4556",
          color2: "#FFF5F5",
        });
        break;
      case "dark":
        setTheme({
          color1: "#53212B",
          color2: "#0F1923",
        });
        break;
      case "jett":
        setTheme({
          color1: "#ECFCFF",
          color2: "#83DDFF",
        });
        break;
      case "plainNight":
        setTheme({
          color1: "#5E5E5E",
          color2: "#2B2B2B",
        });
        break;
      default:
        break;
    }
  }, [name]);

  return (
    <button className="circle-theme" onClick={action}>
        <div className="theme-color" style={{background: `${theme.color1}`}}></div>
        <div className="theme-color" style={{background: `${theme.color2}`}}></div>
    </button>
  );
}
