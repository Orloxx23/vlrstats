import React from "react";
import { Helmet } from "react-helmet-async";

import { PlayerCard, PlayerHistory } from "../../components";
import "./home.css";

export default function Home() {
  const [player, setPlayer] = React.useState(JSON.parse(localStorage.getItem("playerData")) || {});

  return (
    <>
      <Helmet>
        <title>Home | MyStats</title>
      </Helmet>

      <div className="home">
        <PlayerCard action={setPlayer}/>
        <PlayerHistory refresh={player} />
      </div>
    </>
  );
}
