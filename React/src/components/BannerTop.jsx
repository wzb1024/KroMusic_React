import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import { Tabs, Avatar, Result, Button, Upload, message, Radio } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import Download from "@/components/Download";
import Add from "@/components/Add";

const BannerTop = (props) => {
  const [songs, setSongs] = useState([]);
  const [sort, setSort] = useState("飙升");
  const sorts = ["点赞榜", "热歌榜", "飙升榜"];
  const regions = ["内地", "港澳", "欧美", "日韩", "其他"];

  const handleChange = () => {
    if (sort == "飙升") {
      $.getJSON("/Music/Song/GetNewSongs", { count: 20 }, (result) =>
        setSongs(result)
      );
    } else if (sort == "点赞") {
      $.getJSON("/Music/Song/GetPopSongs", { count: 20 }, (result) =>
        setSongs(result)
      );
    } else if (sort == "热歌") {
      $.getJSON("/Music/Song/GetHeatSongs", { count: 20 }, (result) =>
        setSongs(result)
      );
    } else {
      $.getJSON(
        "/Music/Song/GetRegionSongs",
        { region: sort, count: 20 },
        (result) => setSongs(result)
      );
    }
  };
  const playAll = () => {
    var list = new Array();
    songs.forEach((item) => {
      list.push(parseInt(item.Id));
    });
    if (list.length == 0) {
      message.error("暂无可播放音乐");
      return;
    }
    props.addToList(list, true);
  };
  const handlePlay = (id) => {
    var list = [id];
    props.addToList(list, true);
  };
  useEffect(handleChange, [sort]);
  return (
    <>
      <div className="container">
        <div className="toplist_nav_list">
          <Radio.Group
            defaultValue="a"
            buttonStyle="solid"
            defaultValue="飙升榜"
          >
            <ul>
              <li className="toplist_nav_tit">巅峰榜</li>
              {sorts.map((item) => (
                <li className="toplist_nav_item">
                  <Radio.Button
                    type="link"
                    style={{ border: "none" }}
                    onClick={() => setSort(item.substr(0, 2))}
                    value={item}
                  >
                    {item}
                  </Radio.Button>
                </li>
              ))}
            </ul>
            <ul>
              <li className="toplist_nav_tit">地区榜</li>
              {regions.map((item) => (
                <li className="toplist_nav_item">
                  <Radio.Button
                    style={{ border: "none" }}
                    onClick={() => setSort(item)}
                    value={item}
                  >
                    {item}
                  </Radio.Button>
                </li>
              ))}
            </ul>
          </Radio.Group>
        </div>
        {/* <div className="mod_songlist_toolbar">
          <Button
            size="small"
            style={{
              fontSize: "14px",
              padding: "0px 2px",
            }}
            type="primary"
            onClick={playAll}
          >
            <PlayCircleOutlined />
            播放全部
          </Button>
          <ul className="songlist__header">
            <li className="songlist__header_name">歌曲</li>
            <li className="songlist__header_author">歌手</li>
            <li className="songlist__header_time">时长</li>
          </ul>
          <ul>
            {songs.map((item) => (
              <li key={item.Id}>
                <Link to={"/song/" + item.Id}>
                  <ul className="songlist__header">
                    <li className="songlist__header_name">{item.MusicName}</li>
                    <li className="songlist__header_author">{item.Singer}</li>
                    <li className="songlist__header_time">{item.Span}</li>
                  </ul>
                </Link>
              </li>
            ))}
          </ul>
        </div>*/}{" "}
        <div className="mod_songlist_toolbar" id="playlist_content">
          <Button
            size="small"
            style={{
              fontSize: "14px",
              padding: "0px 2px",
              marginLeft: "10px",
            }}
            type="primary"
            onClick={playAll}
          >
            <PlayCircleOutlined />
            播放全部
          </Button>
          <hr />
          <ul style={{ marginTop: "15px" }}>
            <li>歌曲</li>
            <li>歌手</li>
            <li>时长</li>
          </ul>

          {songs.map((item, i) => (
            <ul type="1" key={item.Id}>
              <li style={{ width: "35 %" }}>
                <i> {i + 1}&nbsp;</i>
                <Link to={"/song/" + item.Id}>{item.MusicName}</Link>
              </li>
              <li style={{ width: "25%" }}>
                <Link to={"/singer/" + item.SingerId}>{item.Singer}</Link>
              </li>
              <li style={{ width: "10%" }}>{item.Span}</li>
              <li style={{ textAlign: "center" }}>
                <button
                  onClick={() => handlePlay(item.Id)}
                  className="music_action"
                >
                  <PlayCircleOutlined />
                </button>
                <span className="music_action">
                  <Add id={item.Id} addToList={props.addToList}></Add>
                </span>
                <span className="music_action">
                  <Download data={item} />
                </span>
              </li>
            </ul>
          ))}
        </div>
      </div>
    </>
  );
};
export default BannerTop;
