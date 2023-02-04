/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect } from "react";

import { baseApi } from "../../api";
import { gameModes } from "./filter";
import Loader from "../Loader";
import "./playerHistory.css";
import moment from "moment/moment";
import { images404, randomImg } from "../randomImg";

const errorImage = randomImg(images404);

export default function PlayerHistory({ refresh }) {
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState(gameModes[0]);
  const [error, setError] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [playerData, setPlayerData] = React.useState(
    JSON.parse(localStorage.getItem("playerData")) || null
  );

  const changeGamemode = (e) => {
    setFilter(e.target.value);
  };

  const getHistory = async () => {
    if (!playerData) return;
    if (loading) return;
    setLoading(true);
    await axios
      .get(
        `${baseApi}/valorant/v3/matches/${playerData?.region || "na"}/${
          playerData?.name
        }/${playerData?.tag}?size=10`
      )
      .then((res) => {
        setHistory(res.data.data);
      })
      .catch((err) => {
        setError(true);
      });
    setLoading(false);
  };

  const getHistoryUnrated = async (player) => {
    if(!player) return;
    if (!playerData) return;
    if (loading) return;
    setError(false);
    setLoading(true);
    await axios
      .get(
        `${baseApi}/valorant/v3/matches/${player?.region || "na"}/${
          player?.name
        }/${player?.tag}?filter=unrated&size=10`
      )
      .then((res) => {
        setHistory(res.data.data);
      })
      .catch((err) => {
        setError(true);
      });
    setLoading(false);
  };

  const getHistoryCompetitive = async (player) => {
    if(!player) return;
    if (!playerData) return;
    if (loading) return;
    setError(false);
    setLoading(true);
    await axios
      .get(
        `${baseApi}/valorant/v3/matches/${player?.region || "na"}/${
          player?.name
        }/${player?.tag}?filter=competitive&size=10`
      )
      .then((res) => {
        setHistory(res.data.data);
      })
      .catch((err) => {
        setError(true);
      });
    setLoading(false);
  };

  const loadHistory = (player) => {
    switch (filter) {
      case "all":
        getHistory();
        break;
      case "unrated":
        getHistoryUnrated(player);
        break;
      case "competitive":
        getHistoryCompetitive(player);
        break;
      default:
        getHistory();
        break;
    }
  };

  // useEffect(() => {
  //   getHistory();
  // }, []);

  useEffect(() => {
    if (!firstLoad) {
      loadHistory(JSON.parse(localStorage.getItem("playerData")));
    } else {
      setFirstLoad(false);
    }
  }, [filter]);

  useEffect(() => {
    if (refresh) {
      setPlayerData(refresh);
      loadHistory(refresh);
    }
  }, [refresh]);

  return (
    <>
      <div className="playerHistory">
        <div className="history_filter">
          {gameModes.map((item) => (
            <FilterItem
              key={item}
              item={item}
              selected={filter}
              loading={loading}
              setFilter={changeGamemode}
            />
          ))}
        </div>
        <div className="player_history">
          {!loading ? (
            !error ? (
              history.length > 0 ? (
                history.map((item) => (
                  <HistoryItem
                    name={playerData?.name}
                    key={item?.metadata.matchid}
                    item={item}
                  />
                ))
              ) : (
                <div className="error_history">
                  <p>Nothing here</p>
                </div>
              )
            ) : (
              <div className="error_history">
                <img src={errorImage} alt="" />
                <p>Something's wrong</p>
              </div>
            )
          ) : (
            <div className="loading_history">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FilterItem({ item, selected, setFilter, loading }) {
  return (
    <label
      className={
        item === selected
          ? "history_filter_item item-selected"
          : "history_filter_item"
      }
    >
      <input
        type="checkbox"
        id="filter"
        name="filter"
        value={item}
        checked={item === selected}
        disabled={loading}
        onChange={(e) => setFilter(e)}
      />{" "}
      <p>{item}</p>
    </label>
  );
}

function HistoryItem({ item, name }) {
  const [agent, setAgent] = React.useState("");
  const [player, setPlayer] = React.useState({});
  const [result, setResult] = React.useState({});

  function getFilteredByKey(array, key, value) {
    return array.filter(function (e) {
      return e[key] === value;
    });
  }

  const getPlayer = () => {
    const allplayers = item?.players.all_players;
    const tempPlayer = getFilteredByKey(allplayers, "name", name)[0];
    setPlayer(tempPlayer);
    setAgent(tempPlayer?.assets?.agent?.small);
  };

  const getResult = () => {
    const team = player?.team;
    if (team) {
      const teamBlueVictory = item?.teams.blue.has_won;
      const rounds_won = item?.teams.blue.rounds_won;
      const rounds_lost = item?.teams.blue.rounds_lost;
      const map = item?.metadata.map;
      const mode = item?.metadata.mode;

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

  useEffect(() => {
    getPlayer();
  }, []);

  useEffect(() => {
    getResult();
  }, [player]);

  return (
    <div className="history_item">
      <div className="match_agent">
        <img src={agent || ""} alt="agent" draggable={false} />
      </div>
      <div className="match_info">
        <div className="match_result">
          <p
            className={
              result?.victory
                ? "match_result_title match_result_title-victory"
                : "match_result_title match_result_title-defeat"
            }
          >
            {result?.victory ? "Victory" : "Defeat"}
          </p>
          <p>{result?.mode}</p>
        </div>
        <div className="match_more_info">
          <div className="match_more_info_match">
            <div>
              {result.rounds_won} - {result.rounds_lost}
            </div>
            <div>{result.map}</div>
          </div>
          <div className="match_more_info_kda">
            <div>
              {(
                (player?.stats?.kills + player?.stats?.assists) /
                player?.stats?.deaths
              )
                .toFixed(2)
                .toString()}{" "}
              KDA
            </div>
            <div>
              {`${player?.stats?.kills}/${player?.stats?.deaths}/${player?.stats?.assists}/`}
              <span className="kda_diff">
                {player?.stats?.kills - player?.stats?.deaths > 0
                  ? `+${(
                      player?.stats?.kills - player?.stats?.deaths
                    ).toString()}`
                  : (player?.stats?.kills - player?.stats?.deaths).toString()}
              </span>
            </div>
          </div>
          <div className="match_more_info_timeago">
            <div>{moment(item?.metadata.game_start_patched).fromNow()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
