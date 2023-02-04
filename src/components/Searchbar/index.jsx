import React, { useEffect } from "react";
import "./searchbar.css";

export default function Searchbar({ setSearch, setSearching }) {
  const [playerData, setPlayerData] = React.useState(
    JSON.parse(localStorage.getItem("playerData")) || {}
  );

  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === "" || tag === "" || !name || !tag) return;

    const data = {
      name: name,
      tag: tag,
      region: "na",
    };

    setSearch(data);
    setSearching(true);
  };

  useEffect(() => {
    setPlayerData(JSON.parse(localStorage.getItem("playerData")) || null);
  }, []);

  return (
    <div className="player_searchbar">
      <form onSubmit={onSubmit}>
        <input
          className="player_searchbar_name"
          type="text"
          placeholder={playerData?.name || "Username"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="player_searchbar_tag"
          type="text"
          placeholder={playerData?.tag || "Tag"}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <input className="player_searchbar_submit" type="submit" value="Send" />
      </form>
    </div>
  );
}
