import React from "react";
import "./loader.css";

export default function Loader({ size = 70 }) {
  return <div className="loader" style={{ width: size, height: size }}></div>;
}
