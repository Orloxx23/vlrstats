import React from "react";
import { Helmet } from "react-helmet-async";
import "./news.css";
import NewsCard from "./newsCards";

export default function News() {
  const [news, setNews] = React.useState([]);
  const [lastPatch, setLastPatch] = React.useState();
  const [otherNews, setOtherNews] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [language, setLanguage] = React.useState("en-us");

  React.useEffect(() => {
    if (localStorage.getItem("user") === null) return;

    const tempUser = JSON.parse(localStorage.getItem("user"));
    const tempRegion = tempUser.region;
    let tempLanguage = "";
    switch (tempRegion) {
      case "na":
        tempLanguage = "en-us";
        break;
      case "eu":
        tempLanguage = "en-gb";
        break;
      case "kr":
        tempLanguage = "ko-kr";
        break;
      case "br":
        tempLanguage = "pt-br";
        break;
      case "ap":
        tempLanguage = "en-us";
        break;
      case "latam":
        tempLanguage = "es-mx";
        break;
      default:
        tempLanguage = "en-us";
        break;
    }
    console.log(tempRegion);
    console.log(tempLanguage);
    setLanguage(tempLanguage);
  }, []);

  React.useEffect(() => {
    fetch(`https://api.henrikdev.xyz/valorant/v1/website/${language}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data.data);
        setLoading(false);
      });
  }, [language]);

  React.useEffect(() => {
    if (news.length > 0) {
      let tempNews = news.filter((item) => item.category === "patch_notes");
      setLastPatch(tempNews[0]);
      setLoading(false);
    }
  }, [news]);

  React.useEffect(() => {
    if (news.length > 0) {
      let tempNews = news.filter((item) => item.category !== "patch_notes");
      setOtherNews(tempNews);
      setLoading(false);
    }
  }, [news]);

  return (
    <>
      <Helmet>
        <title>News | MyStats</title>
      </Helmet>

      <div className="news-container">
        <div className="main-news">
          <NewsCard
            banner={lastPatch?.banner_url}
            title={lastPatch?.title}
            url={lastPatch?.url}
            loading={loading}
          />
        </div>
        <div className="more-news">
          <div className="more-news-row">
            <NewsCard
              banner={otherNews?.[0]?.banner_url}
              title={otherNews?.[0]?.title}
              url={otherNews?.[0]?.external_link || otherNews?.[0]?.url}
              loading={loading}
            />
            <NewsCard
              banner={otherNews?.[1]?.banner_url}
              title={otherNews?.[1]?.title}
              url={otherNews?.[1]?.external_link || otherNews?.[1]?.url}
              loading={loading}
            />
          </div>
          <div className="more-news-row">
            <NewsCard
              banner={otherNews?.[2]?.banner_url}
              title={otherNews?.[2]?.title}
              url={otherNews?.[2]?.external_link || otherNews?.[2]?.url}
              loading={loading}
            />
            <NewsCard
              banner={otherNews?.[3]?.banner_url}
              title={otherNews?.[3]?.title}
              url={otherNews?.[3]?.external_link || otherNews?.[3]?.url}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
