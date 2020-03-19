import React, { Component } from "react";
import { Pagination, Spin, message } from "antd";
import $ from "jquery";
import { LikeTwoTone, StarTwoTone, CommentOutlined } from "@ant-design/icons";

class Playlist extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      details: {
        Id: 1,
        Likes: 1,
        OwnerId: 1,
        Description:
          "不那么好过的日子里，要学会每天给自己找一个开心的理由，哪怕只是，阳光很暖，电量很满。",
        CreateTime: "2020/2/10",
        PlayTimes: 1,
        Cover: "\\Sourse\\Playlistcover\\300.jpg",
        Name: "愿你被这个世界温柔以待1",
        NickName: "krokro",
        Tags: ["华语"]
      },
      like: false,
      collected: false
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleCollect = this.handleCollect.bind(this);
  }
  componentDidMount() {
    $.getJSON(
      "/Music/Playlist/PlaylistDetails",
       { id: this.props.location.state.id },
      function(data) {
        this.setState({
          details: data
        });
      }.bind(this)
    );
  }
  handleLike() {
    $.getJSON(
      "/Music/Playlist/PlaylistLike",
      {
        id: this.state.details.Id
      },
      function(result) {
        if (result.State) {

            this.setState({
              like:result.Like
            })

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
        id: this.state.details.Id
      },
      function(result) {
        if (result.State) {

            this.setState({
              collected:result.Collected
            })

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
                <img
                  src={details.Cover}
                  height="160px"
                  width="160px"
                />
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
                    twoToneColor={this.state.like ? "#ff181c" : "#b3b3b3"}
                  />
                </button>
                <button onClick={this.handleCollect}>
                  <StarTwoTone
                    twoToneColor={this.state.collected ? "#52c41a" : "#b3b3b3"}
                  />
                </button>
                <button>
                  <CommentOutlined />
                </button>
              </div>
            </div>

            <div id="playlist_content">
              <div id="playlist_comment"></div>
            </div>
          </>
        )}
      </div>
    );
  }
}
export default Playlist;
