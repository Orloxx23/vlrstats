import React from "react";

export default function NewsCard({ banner, title, url, loading }) {
  return (
    <a
      href={url}
      target="_blank"
      className={loading ? "news-card-loading" : "news-card"}
    >
      <img src={banner} alt="" />
      <p>{title}</p>
    </a>
  );
}
