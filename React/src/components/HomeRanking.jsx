import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import { Divider } from "antd";

const HomeRanking = () => {
  const [newlist, setNewlist] = useState([]);
  const [likelist, setLikelist] = useState([]);
  const [demosticlist, setdemosticlist] = useState([]);
  const [UAlist, setUAlist] = useState([]);
  const [JKlist, setJKlist] = useState([]);
  const init = () => {
    $.getJSON("/Music/Song/GetPopSongs", { count: 4 }, (result) =>
      setLikelist(result)
    );
    $.getJSON("/Music/Song/GetNewSongs", { count: 4 }, (result) =>
      setNewlist(result)
    );
    $.getJSON(
      "/Music/Song/GetRegionSongs",

      { region: "内地", count: 4 },
      (result) => setdemosticlist(result)
    );
    $.getJSON(
      "/Music/Song/GetRegionSongs",
      { region: "欧美", count: 4 },
      (result) => setUAlist(result)
    );
    $.getJSON(
      "/Music/Song/GetRegionSongs",
      { region: "日韩", count: 4 },
      (result) => setJKlist(result)
    );
  };

  useEffect(init, []);
  return (
    <>
      <Card data={likelist} title="流行榜"></Card>
      <Card data={demosticlist} title="内地榜"></Card>
      <Card data={UAlist} title="欧美榜"></Card>
      <Card data={JKlist} title="日韩榜"></Card>
    </>
  );
};
const Card = ({ data, title }) => {
  return (
    <div className="ranking_box">
      <div
        style={{
          width: "100%",
          height: "40px",
          lineHeight: "40px",
          textAlign: "center",
          letterSpacing: "8px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        {title}
      </div>
      <Divider style={{ margin: "8px 0" }}></Divider>
      <ul>
        {data.map((item, i) => (
          <Link key={item.Id} to={"/song/" + item.Id}>
            <li>
              <span
                style={{
                  fontSize: "16px",
                  letterSpacing: "1px",
                  fontWeight: "600",
                }}
              >
                {item.MusicName}
              </span>
              <br />
              <span
                style={{
                  fontSize: "13px",
                  letterSpacing: "0px",
                  fontWeight: "520",
                }}
              >
                {item.Singer}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};
export default HomeRanking;
