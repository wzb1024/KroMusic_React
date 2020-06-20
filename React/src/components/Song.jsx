import React, { Component, useState } from "react";
import { message, Button } from "antd";
import { Comment, Avatar, Input, Tooltip } from "antd";
import Download from "@/components/Download";
import moment from "moment";
import $ from "jquery";
import Add from "@/components/Add";
import { Link } from "react-router-dom";
export default class Song extends Component {
  constructor() {
    super();
    this.state = {
      details: { Tags: [] },
      relate: [],
      comments: [],
      Hdimg: "",
    };

    this.handleLike = this.handleLike.bind(this);
    this.handleCollect = this.handleCollect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReply = this.handleReply.bind(this);
  }
  componentDidMount() {
    var url = window.location.href;
    var id = url.slice(url.lastIndexOf("/") + 1);
    $.getJSON(
      "/Music/Song/GetSongDetails",
      { id: id },
      function (data) {
        this.setState({
          details: data[0],
          relate: data.slice(1),
        });
      }.bind(this)
    );
    $.getJSON(
      "/Music/Song/GetComments",
      { id: id },
      function (data) {
        this.setState({
          comments: data,
          loading: false,
        });
      }.bind(this)
    );
    $.ajax({
      url: "/User/Account/SigninState",
      type: "get",
      dataType: "json",
      success: function (result) {
        if (result.SigninState) {
          this.setState({
            Hdimg: result.Hdimg,
          });
        }
      }.bind(this),
    });
  }
  handlePlay(id) {
    var list = [id];
    this.props.addToList(list, true);
  }
  handleLike() {
    $.getJSON(
      "/Music/Song/SongLike",
      {
        id: this.state.details.Id,
      },
      function (result) {
        if (result.State) {
          var details = this.state.details;
          details.Like = result.Like;
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
      "/Music/Song/SongCollect",
      {
        id: this.state.details.Id,
      },
      function (result) {
        if (result.State) {
          var details = this.state.details;
          details.Favorite = result.Collected;
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
        "/Music/Song/Comment",
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
        "/Music/Song/Reply",
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
    const { details, relate, comments } = this.state;
    return (
      <div id="music_details_box" className="container">
        <div id="music_introduce" className=" shadow">
          <div id="music_cover">
            <img src={details.ImagePath} width="140" height="160" />
          </div>
          <div id="music_title">
            <ul>
              <li>{details.MusicName}</li>
              <li>
                <Link to={"/singer/" + details.SingerId}>
                  {details.SingerName}
                </Link>
              </li>
            </ul>
            <ul>
              <li>流派：{details.Genre}</li>
              <li>发布时间：{details.ReleaseTime}</li>
              <li>播放量：{details.PlayTimes}</li>
            </ul>
          </div>
        </div>
        <div id="music_operate" className="shadow">
          <ul>
            <li>
              <button onClick={() => this.handlePlay(details.Id, true)}>
                <i className="fa fa-play-circle-o" aria-hidden="true"></i>
              </button>
            </li>
            <li>
              <button onClick={this.handleLike}>
                {details.Like ? (
                  <i
                    className="fa fa-thumbs-up"
                    aria-hidden="true"
                    style={{ color: "red" }}
                  ></i>
                ) : (
                  <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                )}
              </button>
            </li>
            <li>
              <button onClick={this.handleCollect}>
                {details.Favorite ? (
                  <i
                    className="fa fa-heart"
                    aria-hidden="true"
                    style={{ color: "red" }}
                  ></i>
                ) : (
                  <i className="fa fa-heart-o" aria-hidden="true"></i>
                )}
              </button>
            </li>
            <li>
              <Add id={details.Id} addToList={this.props.addToList}></Add>
            </li>
            <li>
              <Download data={details} />
            </li>
          </ul>
        </div>
        {/* <div id="music_lyric_box" className="shadow">
          <h2
            style={{
              letterSpacing: "2px",
              color: "rgba(0,0,0,0.5)",
              fontSize: "16px",
            }}
          >
            歌词
          </h2>
        </div> */}
        <div id="music_comment">
          <div>
            <Comment
              avatar={
                <Avatar
                  src={
                    this.state.Hdimg == ""
                      ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      : this.state.Hdimg
                  }
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
              <div key={item.Id} style={{ margin: "2px 0px" }}>
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
                      title={moment(item.Time).format("YYYY-MM-DD HH:mm:ss")}
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
                          title={moment(it.Time).format("YYYY-MM-DD HH:mm:ss")}
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
        <div id="relate_music_box">
          <h4>相关音乐</h4>
          {relate.map((item) => (
            <Link key={item.Id} to={"/song/" + item.Id}>
              <div className="relate_music shadow">
                <img
                  src={item.ImagePath}
                  style={{
                    float: "left",
                    marginRight: "15px",
                  }}
                  height="60px"
                  width="50px"
                />
                <div style={{ fontSize: "16px", lineHeight: "60px" }}>
                  {item.MusicName}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
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
          setValue("");
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
  const id = props.targetId;
  return (
    <div>
      <span style={{ marginRight: "15px" }}>
        <button
          onClick={(e) => {
            $(`#${id}`).css("display", "inline");
          }}
        >
          回复
        </button>
      </span>
      <span style={{ display: "none" }} id={id}>
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
            $(`#${id}`).css("display", "none");
            setValue("");
          }}
          style={{ padding: "0px", marginLeft: "5px" }}
        >
          确认
        </Button>
        <Button
          htmlType="submit"
          type="link"
          onClick={(e) => {
            $(`#${id}`).css("display", "none");
            setValue("");
          }}
          style={{ padding: "0px", marginLeft: "5px" }}
        >
          取消
        </Button>
      </span>
    </div>
  );
};
