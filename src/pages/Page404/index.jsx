import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./page404.css";
import Loader from "../../components/Loader";
import { images404, randomImg } from "../../components/randomImg";
import { Helmet } from "react-helmet-async";

let image = randomImg(images404);

export default function Page404() {
  let navigate = useNavigate();
  const [MousePosition, setMousePosition] = useState({
    left: 0,
    top: 0,
  });

  function handleMouseMove(ev) {
    setMousePosition({ left: ev.pageX, top: ev.pageY });
  }

  return (
    <>
      <Helmet>
        <title>404 | MyStats</title>
      </Helmet>
      <div
        onMouseMove={(ev) => handleMouseMove(ev)}
        style={{ left: MousePosition.left, top: MousePosition.top }}
      >
        <div className="page404">
          <h1>Sorry, page not found!</h1>
          <p>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </p>
          {image ? (
            <img
              src={image}
              alt=""
              style={{
                transform: `rotateX(${MousePosition.top / 50}deg) rotateY(${
                  MousePosition.left / 50
                }deg)`,
              }}
            />
          ) : (
            <div style={{ margin: "12rem 0" }}>
              <Loader />
            </div>
          )}
          <button onClick={() => navigate("/")}>Go to home</button>
        </div>
      </div>
    </>
  );
}
