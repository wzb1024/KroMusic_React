import React, { Component, useState } from "react";
import { message, Button } from "antd";
import $ from "jquery";
import Add from "@/components/Add";
import {
  LikeTwoTone,
  StarTwoTone,
  CommentOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
export default class Singer extends Component {
  constructor() {
    super();
    this.state = {
      details: {
        Focused: false,
      },
      songs: [],
    };
    this.playAll = this.playAll.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }
  componentDidMount() {
    var url = window.location.href;
    var id = url.slice(url.lastIndexOf("/") + 1);
    $.getJSON(
      "/Music/Singer/GetDetails",
      { id: id },
      function (result) {
        this.setState({
          details: result,
        });
      }.bind(this)
    );
    $.getJSON(
      "/Music/Singer/GetSongs",
      { id: id },
      function (result) {
        this.setState({
          songs: result,
        });
      }.bind(this)
    );
  }
  playAll() {
    var list = new Array();
    this.state.songs.forEach((item) => {
      list.push(parseInt(item.Id));
    });
    if (list.length == 0) {
      message.error("暂无可播放音乐");
      return;
    }
    this.props.addToList(list, true);
  }
  handlePlay(id) {
    var list = [id];
    this.props.addToList(list, true);
  }
  handleFocus() {
    $.getJSON(
      "/User/Account/Focus",
      { id: this.state.details.Id },
      function (result) {
        if (result.State) {
          var de = this.state.details;
          if (result.Focused) {
            message.success("已关注");
            de.Fans += 1;
          } else {
            message.success("取消关注");
            de.Fans -= 1;
          }
          de.Focused = result.Focused;
          this.setState({ details: de });
        } else {
          message.error(result.Message);
        }
      }.bind(this)
    );
  }
  render() {
    const { details } = this.state;
    return (
      <div id="singer_container" className="container">
        <div id="music_introduce" className=" shadow">
          <div id="music_cover">
            <img src={details.Image} width="140" height="160" />
          </div>
          <div id="music_title">
            <ul>
              <li style={{ fontSize: "20px", fontWeight: "bold" }}>
                {details.Name}
              </li>
              <li>年龄：{details.Age}</li>
              <li>性别：{details.Gender}</li>
              <li>地区：{details.Nationality}</li>
              <li title={details.Profession}>职业：{details.Profession}</li>
            </ul>
            <ul>
              {" "}
              <li>关注人数：{details.Fans}</li>
              <li>单曲数：{details.Amount}</li>
            </ul>
            <ul>
              <li>
                <Button
                  onClick={this.handleFocus}
                  type={details.Focused ? "default" : "primary"}
                >
                  {details.Focused ? "已关注" : "关注"}
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <div id="singer_content">
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
            <li style={{ width: "50%" }}>歌曲</li>
            <li>时长</li>
          </ul>

          {this.state.songs.map((item, i) => (
            <ul type="1" key={item.Id}>
              <li style={{ width: "50%" }}>
                <i> {i + 1}&nbsp;</i>
                <Link to={"/song/" + item.Id}>{item.MusicName}</Link>
              </li>
              <li style={{ width: "10%" }}>{item.Span}</li>
              <li style={{ textAlign: "center" }}>
                <button
                  onClick={() => this.handlePlay(item.Id)}
                  className="music_action"
                >
                  <PlayCircleOutlined />
                </button>
                <button className="music_action">
                  <Add id={item.Id} addToList={this.props.addToList}></Add>
                </button>
              </li>
            </ul>
          ))}
        </div>
      </div>
    );
  }
}
