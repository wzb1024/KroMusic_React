import React, { Component } from "react";
import { Pagination, Spin, message, Button } from "antd";
import Player from "@/components/Player";
import $ from "jquery";
import {
  LikeTwoTone,
  StarTwoTone,
  CommentOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

class Playlist extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      details: {Tags:[]},
      songs: [],
    };

    this.handleLike = this.handleLike.bind(this);
    this.handleCollect = this.handleCollect.bind(this);
    this.playAll = this.playAll.bind(this);
  }
  componentDidMount() {
    var url = window.location.href;
    var id = url.slice(url.lastIndexOf("/") + 1);
    $.getJSON(
      "/Music/Playlist/PlaylistDetails",
      { id: id },
      function (data) {
        this.setState({
          details: data,
          loading: false,
        });
      }.bind(this)
    );
    $.getJSON(
      "/Music/Playlist/GetSongs",
      { id: id },
      function (data) {
        this.setState({
          songs: data,
          loading: false,
        });
      }.bind(this)
    );
  }
  playAll() {  
    var list = new Array();
    this.state.songs.forEach((item) => {
      list.push(parseInt(item.Id));
    });
    this.props.addToList(list,true);
  }
  handlePlay(id){
    var list=[id];
    this.props.addToList(list,true);
  }
  handleLike() {
    $.getJSON(
      "/Music/Playlist/PlaylistLike",
      {
        id: this.state.details.Id,
      },
      function (result) {
        if (result.State) {
          var details = this.state.details;
          if (result.Like) {
            details.IsLiked = true;
          } else {
            details.IsLiked = false;
          }

          this.setState({
            details: details,
          });
          message.success(result.Message);
        } else {
          message.error(result.Message);
        }
      }.bind(this)
    );
  }
  handleCollect() {
    $.getJSON(
      "/Music/Playlist/PlaylistCollect",
      {
        id: this.state.details.Id,
      },
      function (result) {
        if (result.State) {
          var details = this.state.details;
          if (result.Collected) {
            details.IsCollected = true;
          } else {
            details.IsCollected = false;
          }
          this.setState({
            details: details,
          });
          message.success(result.Message);
        } else {
          message.error(result.Message);
        }
      }.bind(this)
    );
  }
  render() {
    const { details } = this.state;
    return (
      <div id="playlist_container" className="container">
        {this.state.loading ? (
          <Spin size="large" />
        ) : (
          <>
            <div id="playlist_intro">
              <div id="playlist_cover">
                <img src={details.Cover} height="160px" width="160px" />
              </div>
              <ul>
                <li>
                  <em style={{ fontWeight: "bold", fontSize: "15px" }}>
                    {details.Name}
                  </em>
                </li>
                <li>
                  <label>创建者:&nbsp;</label>
                  <a>{details.NickName}</a>
                </li>
                <li>
                  <label>创建时间:&nbsp;</label>
                  <em>{details.CreateTime}</em>
                </li>
                <li>
                  <label>标签:&nbsp;</label>
                  {details.Tags.map((item, i) => (
                    <span key={i}>{item}</span>
                  ))}
                </li>
                <li>
                  <label>播放量:&nbsp;</label>
                  <em>{details.PlayTimes}</em>
                </li>
                <li>
                  <label>点赞:&nbsp;</label>
                  <em>{details.PlayTimes}</em>
                </li>
                <li>
                  <label>简介:&nbsp;</label>
                  <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {details.Description}
                  </p>
                </li>
              </ul>
              <div id="playlist_operate">
                <button onClick={this.handleLike}>
                  <LikeTwoTone
                    twoToneColor={details.IsLiked ? "#ff181c" : "#b3b3b3"}
                  />
                </button>
                <button onClick={this.handleCollect}>
                  <StarTwoTone
                    twoToneColor={details.IsCollected ? "#52c41a" : "#b3b3b3"}
                  />
                </button>
                <button>
                  <CommentOutlined />
                </button>
              </div>
            </div>
            <div id="playlist_content">
              <em style={{ fontSize: "16px", fontWeight: "bold" }}>全部歌曲</em>
              <Button
                size="small"
                style={{
                  fontSize: "14px",
                  padding: "0px 2px",
                  marginLeft: "10px",
                }}
                type="primary"
                onClick={this.playAll}
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

              {this.state.songs.map((item, i) => (
                <ul type="1" key={item.Id}>
                  <li style={{ width: "35 %" }}>
                    <i> {i + 1}&nbsp;</i>
                    {item.MusicName}
                  </li>
                  <li style={{ width: "25%" }}>{item.SingerName}</li>
                  <li style={{ width: "10%" }}>{item.Span}</li>
                  <li style={{ textAlign: "center" }}>
                    <button
                      onClick={() => this.props.handlePlay(item.Id)}
                      className="music_action"
                    >
                      <PlayCircleOutlined />
                    </button>
                    <button className="music_action">
                      <PlusCircleOutlined />
                    </button>
                  </li>
                </ul>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}
export default Playlist;
