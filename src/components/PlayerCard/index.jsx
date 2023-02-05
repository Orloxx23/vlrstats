/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React from "react";

import Icon from "../Icon";
import { baseApi } from "../../api";
import { images404, randomImg } from "../randomImg";
import "./playerCard.css";
import Searchbar from "../Searchbar";

let image = randomImg(images404);

export default function PlayerCard({ action }) {
  const [playerData, setPlayerData] = React.useState(
    JSON.parse(localStorage.getItem("playerData")) || null
  );
  const [searching, setSearching] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  let data = {};

  const loadData = async () => {
    if (!playerData) return;
    setLoading(true);

    if (localStorage.getItem("playerData")) {
      const dataCache = JSON.parse(localStorage.getItem("playerData"));
      setPlayerData(dataCache);
      if (Object.entries(dataCache).length === 0) {
        setError(true);
        localStorage.removeItem("playerData");
      }
      setLoading(false);
      return;
    }

    await getPlayerData();
  };

  const getPlayerData = async () => {
    if (!playerData) return;
    setLoading(true);

    await getAccount();
    await getMmr();

    setPlayerData(data);
    action(data);
    localStorage.setItem("playerData", JSON.stringify(data));
    setLoading(false);
  };

  const getAccount = async () => {
    if (!playerData) return;
    await axios
      .get(
        `${baseApi}/valorant/v1/account/${playerData?.name}/${playerData?.tag}`
      )
      .then((res) => {
        data = {
          ...data,
          name: res.data.data.name,
          tag: res.data.data.tag,
          image: res.data.data.card.small,
          cover: res.data.data.card.wide,
        };
      })
      .catch((err) => {
        setError(true);
      });
  };

  const getMmr = async () => {
    if (!playerData) return;
    await axios
      .get(
        `${baseApi}/valorant/v1/mmr/${playerData?.region || "na"}/${
          playerData?.name
        }/${playerData?.tag}`
      )
      .then((res) => {
        data = {
          ...data,
          rank: res.data.data.currenttierpatched,
          mmr: res.data.data.ranking_in_tier,
          rankIcon: res.data.data.images.large,
        };
      })
      .catch((err) => {
        setError(true);
      });
  };

  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    if (searching) {
      localStorage.removeItem("playerData");
      setError(false);
      loadData();
      setSearching(false);
    }
  }, [searching]);

  return (
    <div className="card_and_searchbar">
      <Searchbar setSearch={setPlayerData} setSearching={setSearching} />
      {playerData ? (
        !error ? (
          <div className="player_card">
            <div
              className={`updateData ${loading ? "invisible" : ""}`}
              onClick={getPlayerData}
            >
              <Icon icon="arrows-rotate" />
            </div>
            <div
              className={
                loading ? "player_card_cover-loading" : "player_card_cover"
              }
            >
              <div className="gausiano"></div>
              <img src={loading ? "" : playerData?.cover} alt="" />
            </div>
            <div className="player_card_content">
              <div
                className={
                  loading ? "player_card_image-loading" : "player_card_image"
                }
              >
                <img src={playerData.image} alt="" draggable="false" />
                
              </div>
              <div className="player_card_name">
                  {loading ? "" : playerData?.name + "#" + playerData?.tag}
                </div>
              <div className="player_card_info">
                <div
                  className={
                    loading ? "player_card_rank-loading" : "player_card_rank"
                  }
                >
                  <div
                    className={loading ? "invisible" : "player_card_rank_icon"}
                  >
                    <img src={playerData?.rankIcon} alt="" draggable="false" />
                  </div>
                  <div
                    className={loading ? "invisible" : "player_card_rank_info"}
                  >
                    <div className="player_card_rank_name">
                      {playerData?.rank}
                    </div>
                    {/* <div className="player_card_rank_winrate">
                      {"18W 11L "}
                      <span>62%</span>
                    </div> */}
                    <div className="player_card_rank_mmr">
                      <div className="mmr_progress">
                        <div
                          className="mmr_progress_bar"
                          style={{
                            width: `${
                              loading
                                ? 0
                                : playerData?.mmr > 100
                                ? 100
                                : playerData?.mmr
                            }%`,
                          }}
                        ></div>
                        <div
                          className={
                            loading ? "invisible" : "mmr_progress_bar_bg"
                          }
                        ></div>
                      </div>
                      <div className="mmr_number">{playerData?.mmr}</div>
                    </div>
                  </div>
                </div>
                <hr className={loading ? "invisible" : ""} />
              </div>
            </div>
          </div>
        ) : (
          <div className="player_card-error">
            <div
              className={`updateData ${loading ? "invisible" : ""}`}
              onClick={getPlayerData}
            >
              <Icon icon="arrows-rotate" />
            </div>
            <span style={{ fontWeight: 700 }}>Something went wrong</span>
            <img src={image} style={{ width: "80%" }} alt="" />
            <span>Make sure you enter the data correctly</span>
          </div>
        )
      ) : (
        <div className="player_card-error">
          <span style={{ fontWeight: 700 }}>
            Search for a player to get their stats
          </span>

          <span>Remember to use a name and tag (Name#VAL)</span>
          {/* <img src={image} style={{ width: "80%" }} alt="" /> */}
        </div>
      )}
    </div>
  );
}
