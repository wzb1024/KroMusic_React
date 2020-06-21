import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import { Tabs, Avatar, Result, Button, Upload, message } from "antd";
const BannerTop = () => {
  const [songs, setSongs] = useState([]);
  const [sort, setSort] = useState("");

  const init = () => {
    $.getJSON("/Music/Song/GetPopSongs", (result) => setSongs(result));
  };
  const handleChange = () => {
    if (sort == "上新") {
      $.getJSON("/Music/Song/GetNewSongs", (result) => setSongs(result));
    } else if (sort == "点赞") {
      $.getJSON("/Music/Song/GetPopSongs", (result) => setSongs(result));
    } else if (sort == "热歌") {
      $.getJSON("/Music/Song/GetHeatSongs", (result) => setSongs(result));
    } else {
      $.getJSON("/Music/Song/GetRegionSongs", { region: sort }, (result) =>
        setSongs(result)
      );
    }
  };
  useEffect(init, []);
  useEffect(handleChange, [sort]);
  return (
    <>
      <div className="container">
        <div className="toplist_nav_list">
          <dl style={{ marginBottom: "20px" }}>
            <dt className="toplist_nav_tit">巅峰榜</dt>
            <dd className="toplist_nav_item">
              <button onClick={() => setSort("点赞")}>点赞榜</button>
            </dd>
            <dd className="toplist_nav_item">
              <button onClick={() => setSort("热歌")}>热歌榜</button>
            </dd>
            <dd className="toplist_nav_item">
              <button onClick={() => setSort("上新")}>上新榜</button>
            </dd>
          </dl>
          <dl style={{ marginBottom: "20px" }}>
            <dt className="toplist_nav_tit">地区榜</dt>
            <dd className="toplist_nav_item">
              <button onClick={() => setSort("内地")}>内地榜</button>
            </dd>
            <dd className="toplist_nav_item">
              <button onClick={() => setSort("港澳")}>港澳台地区榜</button>
            </dd>
            <dd className="toplist_nav_item">
              <button onClick={() => setSort("欧美")}>欧美榜</button>
            </dd>
            <dd className="toplist_nav_item">
              <button onClick={() => setSort("日韩")}>日韩榜</button>
            </dd>
          </dl>
        </div>
        <div className="mod_songlist_toolbar">
          <button className="mod_btn_green">
            <i className="mod_btn_green__icon_play ">播放全部</i>
          </button>
        </div>
        <div>
          <ul className="songlist__header">
            <li className="songlist__header_name">歌曲</li>
            <li className="songlist__header_author">歌手</li>
            <li className="songlist__header_time">时长</li>
          </ul>
          <ul>
            {songs.map((item) => (
              <li key={item.Id}>
                <Link to={"/song/" + item.Id}>
                  {" "}
                  <div className="songlist_song">
                    <span>{item.MusicName}</span>
                    <span className="songlist_singer">{item.Singer}</span>
                    <span className="songlist_time">{item.Span}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default BannerTop;
