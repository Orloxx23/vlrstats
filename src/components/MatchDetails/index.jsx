import React from "react";
import Icon from "../Icon";
import Loader from "../Loader";
import "./matchDetails.css";

export default function MatchDetails({ match, onBack }) {
  const [player, setPlayer] = React.useState(
    JSON.parse(localStorage.getItem("playerData")) || null
  );
  const [result, setResult] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [players, setPlayers] = React.useState(
    match ? match.players.all_players : []
  );

  function getFilteredByKey(array, key, value) {
    return array.filter(function (e) {
      return e[key] === value;
    });
  }

  const getPlayer = () => {
    const allplayers = match?.players.all_players;
    const tempPlayer = getFilteredByKey(allplayers, "name", player.name)[0];
    setPlayer(tempPlayer);
  };

  const getResult = () => {
    const team = player?.team;
    if (team) {
      const teamBlueVictory = match?.teams.blue.has_won;
      const rounds_won = match?.teams.blue.rounds_won;
      const rounds_lost = match?.teams.blue.rounds_lost;
      const map = match?.metadata.map;
      const mode = match?.metadata.mode;

      if (team === "Blue" && teamBlueVictory) {
        const tempResult = {
          victory: true,
          rounds_won: rounds_won,
          rounds_lost: rounds_lost,
        };
        setResult(tempResult);
        setResult((prevState) => ({ ...prevState, map: map, mode: mode }));
        return;
      } else if (team === "Blue" && !teamBlueVictory) {
        const tempResult = {
          victory: false,
          rounds_won: rounds_won,
          rounds_lost: rounds_lost,
        };
        setResult(tempResult, { map: map, mode: mode });
        setResult((prevState) => ({ ...prevState, map: map, mode: mode }));
        return;
      }

      if (team === "Red" && !teamBlueVictory) {
        const tempResult = {
          victory: true,
          rounds_won: rounds_lost,
          rounds_lost: rounds_won,
        };
        setResult(tempResult);
        setResult((prevState) => ({ ...prevState, map: map, mode: mode }));
        return;
      } else if (team === "Red" && teamBlueVictory) {
        const tempResult = {
          victory: false,
          rounds_won: rounds_lost,
          rounds_lost: rounds_won,
        };
        setResult(tempResult);
        setResult((prevState) => ({ ...prevState, map: map, mode: mode }));
        return;
      }
    }
  };

  React.useEffect(() => {
    if (match) {
      setLoading(false);
    }
  }, [match]);

  React.useEffect(() => {
    getPlayer();
  }, []);

  React.useEffect(() => {
    getResult();
  }, [player]);

  React.useEffect(() => {
    if (players) {
      let tempPlayers = players;
      tempPlayers.sort(function (a, b) {
        if (a.stats.score < b.stats.score) {
          return 1;
        }
        if (a.stats.score > b.stats.score) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      setPlayers(tempPlayers);
    }
  }, [players]);

  return (
    <>
      {!loading ? (
        <div className={`matchDetails ${!match && "hide"}`}>
          <div className="matchDetails__header">
            <div className="matchDetails__back" onClick={onBack}>
              <Icon icon="arrow-left" />
            </div>
            <div className="matchDetails__title">
              <div
                className={`matchDetails__result__title ${
                  result && result.victory
                    ? "matchDetails__result__title__victory"
                    : "matchDetails__result__title__defeat"
                }`}
              >
                {result && (result.victory ? "Victory" : "Defeat")}
              </div>
              <div className="matchDetails__result__desc">
                {result && result.map},{" "}
                {result && `${result.rounds_won}-${result.rounds_lost}`}
              </div>
            </div>
            <div className="matchDetails__date"></div>
          </div>
          <div className="matchDetails__body">
            {match &&
              players.map((player) => (
                <DetailsPlayer
                  key={player.name}
                  name={player.name}
                  agent={player.assets.agent.small}
                  stats={player.stats}
                  team={player.team}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className="matchDetails__loading">
          <Loader />
        </div>
      )}
    </>
  );
}

function DetailsPlayer({ name, agent, stats, team }) {
  const [player, setPlayer] = React.useState(false);
  React.useEffect(() => {
    const tempPlayer = JSON.parse(localStorage.getItem("playerData"));
    if (tempPlayer && tempPlayer.name === name) {
      setPlayer(true);
    }
  }, [player]);
  return (
    <>
      <div
        className={`detailsPlayer ${
          team == "Blue" ? "detailsPlayer-blue" : "detailsPlayer-red"
        } ${player && "detailsPlayer__me"}`}
      >
        <div className="detailsPlayer__agent">
          <img src={agent} alt="" />
        </div>
        <div className="detailsPlayer__info">
          <div className="detailsPlayer__name">{name}</div>
          <div className="detailsPlayer__stats">
            {`${stats.kills} / ${stats.deaths} / ${stats.assists}`}
          </div>
        </div>
      </div>
    </>
  );
}
