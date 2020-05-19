import React, { Component, useState } from "react";
import { Pagination, Spin, message, Button } from "antd";
import { Comment, Avatar, Form, List, Input, Tooltip } from "antd";
import moment from "moment";
import Add from "@/components/Add";
import $ from "jquery";
import {
  LikeTwoTone,
  StarTwoTone,
  CommentOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
moment.locale("zh-cn");
class Playlist extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      details: { Tags: [] },
      songs: [],
      comments: [],
    };

    this.handleLike = this.handleLike.bind(this);
    this.handleCollect = this.handleCollect.bind(this);
    this.playAll = this.playAll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReply = this.handleReply.bind(this);
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
    $.getJSON(
      "/Music/Playlist/GetComments",
      { id: id },
      function (data) {
        this.setState({
          comments: data,
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
  handleSubmit(e) {
    if (e != "")
      $.post(
        "/Music/Playlist/Comment",
        { id: this.state.details.Id, value: e },
        function (result) {
          if (result.State) {
            this.setState({
              comments: [result.Model, ...this.state.comments],
            });
          } else {
            message.error(result.Message);
          }
        }.bind(this)
      );
  }
  handleReply(targetId, value, position) {
    if (value != "") {
      var com = this.state.comments;
      var sub = com[position].SubComments;
      $.post(
        "/Music/Playlist/Reply",
        { id: this.state.details.Id, value: value, targetId: targetId },
        function (result) {
          if (result.State) {
            sub = [result.Model].concat(sub);
            com[position].SubComments = sub;
            this.setState({
              comments: com,
            });
          } else {
            message.error(result.Message);
          }
        }.bind(this)
      );
      this.setState({
        comments: com,
      });
    }
  }
  handleShow() {
    var $div = $(event.target);
    var dis = $div.next().css("display");
    if (dis == "none") {
      $div.next().css("display", "block");
    } else {
      $div.next().css("display", "none");
    }
  }
  render() {
    const { details, comments } = this.state;
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
                    <Link to={"/song/" + item.Id}>{item.MusicName}</Link>
                  </li>
                  <li style={{ width: "25%" }}>
                    <Link to={"/singer/" + item.SingerId}>
                      {item.SingerName}
                    </Link>
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
            <div id="playlist_comment">
              <div>
                <Comment
                  avatar={
                    <Avatar
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      alt="Han Solo"
                    />
                  }
                  content={<Editor onSubmit={this.handleSubmit} />}
                />
                <h3
                  style={{
                    padding: "10px 0px",
                    borderBottom: "1px solid gray",
                    marginBottom: "20px",
                  }}
                >
                  全部评论&nbsp;<small>共{comments.length}条评论</small>
                </h3>
                {comments.map((item, i) => (
                  <div key={item.Id}>
                    <Comment
                      actions={[
                        <SubEditor
                          position={i}
                          targetId={item.Id}
                          onSubmit={this.handleReply}
                        />,
                      ]}
                      author={<a>{item.NickName}</a>}
                      avatar={
                        <a href="https://www.baidu.com">
                          <Avatar src={item.Hdimg} alt="Han Solo" />
                        </a>
                      }
                      content={<p>{item.Content}</p>}
                      datetime={
                        <Tooltip
                          title={moment(item.Time).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        >
                          <span>{moment(item.Time).fromNow()}</span>
                        </Tooltip>
                      }
                    />
                    <div
                      onClick={this.handleShow}
                      style={{ cursor: "pointer", marginLeft: "45px" }}
                    >
                      共{item.SubComments.length}条回复
                    </div>
                    <div style={{ display: "none" }}>
                      {item.SubComments.map((it) => (
                        <Comment
                          style={{ marginLeft: "40px" }}
                          key={it.Id}
                          actions={[
                            <SubEditor
                              position={i}
                              targetId={it.Id}
                              onSubmit={this.handleReply}
                            />,
                          ]}
                          author={
                            <span>
                              <a>{it.NickName}</a>&nbsp;
                              {it.TargetId !== item.Id && (
                                <span>
                                  回复&nbsp;
                                  <a>
                                    <Avatar size="small" src={it.TarHdimg} />
                                    {it.TarName}
                                  </a>
                                </span>
                              )}
                            </span>
                          }
                          avatar={<Avatar src={it.Hdimg} alt="Han Solo" />}
                          content={<p>{it.Content}</p>}
                          datetime={
                            <Tooltip
                              title={moment(it.Time).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            >
                              <span>{moment(it.Time).fromNow()}</span>
                            </Tooltip>
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}
export default Playlist;

const Editor = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <Input.TextArea
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Button
        htmlType="submit"
        type="primary"
        onClick={(e) => {
          onSubmit(value);
          $(e.target).prev().val("");
        }}
        style={{ marginTop: "5px" }}
      >
        确认
      </Button>
    </div>
  );
};
const SubEditor = (props) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <span style={{ marginRight: "15px" }}>
        <button
          onClick={(e) => {
            $(e.target).parent().next().css("display", "inline");
          }}
        >
          回复
        </button>
      </span>
      <span style={{ display: "none" }}>
        <Input.TextArea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: "480px" }}
        />
        <Button
          htmlType="submit"
          type="link"
          onClick={(e) => {
            props.onSubmit(props.targetId, value, props.position);
            $(e.target).parent().css("display", "none");
            $(e.target).prev().val("");
          }}
          style={{ padding: "0px", marginLeft: "5px" }}
        >
          确认
        </Button>
        <Button
          htmlType="submit"
          type="link"
          onClick={(e) => {
            $(e.target).parent().css("display", "none");
            $(e.target).prev().prev().val("");
          }}
          style={{ padding: "0px", marginLeft: "5px" }}
        >
          取消
        </Button>
      </span>
    </div>
  );
};
