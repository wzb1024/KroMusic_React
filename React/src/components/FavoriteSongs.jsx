import React, { Component } from "react";
import { Tabs, Avatar, Result, Button, Upload, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import $ from "jquery";
import Add from "@/components/Add";

class FavoriteSongs extends Component {
  constructor() {
    super();
    this.state = { songs: [] };
    this.playAll = this.playAll.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  componentDidMount() {
    $.getJSON(
      "/User/Account/GetFavoSongs",
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
  handleRemove(id) {
    $.getJSON(
      "/User/Account/RmFavoSong",
      { id: id },
      function (result) {
        if (result.State) {
          if (result.result) {
            message.success("删除成功");
            this.setState({
              songs: this.state.songs.filter((item) => item.Id != id),
            });
          } else message.error("删除失败，稍后再试");
        } else {
          message.error(result.Message);
        }
      }.bind(this)
    );
  }
  render() {
    return (
      <div id="favorite_songs">
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
              <Link to={"/song/" + item.Id}>{item.MusicName}</Link>
            </li>
            <li style={{ width: "25%" }}>
              {" "}
              <Link to={"/singer/" + item.SingerId}>{item.SingerName}</Link>
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
              <button
                className="music_action"
                onClick={() => this.handleRemove(item.Id)}
              >
                <i className="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            </li>
          </ul>
        ))}
      </div>
    );
  }
}
export default FavoriteSongs;
