import React from "react";

export default function Icon({ type = "solid", icon }) {
  return <i className={`fa-${type} fa-${icon}`}></i>;
}
