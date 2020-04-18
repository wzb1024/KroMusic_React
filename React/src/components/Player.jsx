import React, { Component } from "react";
import { Avatar, message } from "antd";
import $ from "jquery";

class Player extends Component {
  constructor() {
    super();
    this.state = {
      visible: true,
      current: {
        Id: 0,
        MusicName: "暂无可播放音乐",
        SingerName: "",
        favorate: false,
        Span: 0,
        ImagePath: "",
        Path: "",
      },
      currentTime: 0,
      index: 0,
      volume: 0,
      playing: false,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleProgessDrag = this.handleProgessDrag.bind(this);
    this.handleVolumeDrag = this.handleVolumeDrag.bind(this);
  }
  init(mlist) {
    if (mlist.length > 0) {
      var m = mlist[0];
      this.setState({
        index: 0,
        currentTime: 0,
        current: m,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    var mlist = nextProps.mlist;
    this.init(mlist);
  }
  componentDidMount() {
    this.audio = document.getElementById("audio");
    this.setState({
      volume: this.audio.volume,
    });
    $("#favolumntag").click(
      function () {
        if (this.state.volume == 0) {
          this.setState({
            volume: 0.4,
          });
        } else {
          this.setState({
            volume: 0,
          });
        }
      }.bind(this)
    );
    this.handleProgessDrag();
    this.handleVolumeDrag();
    const mlist = this.props.mlist;
    this.init(mlist);
  }

  handleShow() {
    if (this.state.visible) {
      this.setState({
        visible: false,
      });
    } else {
      this.setState({
        visible: true,
      });
    }
  }
  handlePlay() {
    if (this.props.mlist.length > 0) {
      this.audio.play();
    } else {
      message.error("暂无可播放音乐");
    }
  }

  handlePrev() {
    if (this.props.mlist.length > 0) {
      this.audio.pause();
      var index = this.state.index;
      var list = this.props.mlist;
      var len = list.length;
      var m = null;
      if (index > 0) {
        m = list[index - 1];
        index = index - 1;
      } else {
        m = list[len - 1];
        index = len - 1;
      }
      this.setState(
        {
          current: m,
          index: index,
          currentTime: 0,
        },
        () => this.handlePlay()
      );
    } else {
      message.error("暂无可播放音乐");
    }
  }

  handleNext() {
    if (this.props.mlist.length > 0) {
      this.audio.pause();
      let index = this.state.index;
      var list = this.props.mlist;
      var m = null;
      var len = list.length;
      if (index < len - 1) {
        m = list[index + 1];
        index = index + 1;
      } else {
        m = list[0];
        index = 0;
      }
      this.setState(
        {
          index: index,
          currentTime: 0,
          current: m,
        },
        () => this.handlePlay()
      );
    } else {
      message.error("暂无可播放音乐");
    }
  }
  handleVolumeDrag() {
    var $arc = $("#volumearc");
    var drag = false;
    var tot = $("#volume").width();
    var initx = $("#volume").offset().left;
    var $container = $("#m_operate");
    $arc.mousedown(() => {
      drag = true;
      $arc.width("14px").height("14px");
    });
    $container.mousemove((e) => {
      let curx = e.clientX;
      var progs = (curx - initx) / tot;
      if (drag && progs >= 0 && progs <= 1) {
        this.setState(
          {
            volume: progs,
          },
          () => (this.audio.volume = this.state.volume)
        );
      }
    });
    $container.mouseup(() => {
      if (drag) {
        drag = false;
        $arc.width("12px").height("12px");
      }
    });
    $container.mouseleave(() => {
      if (drag) {
        drag = false;
        $arc.width("12px").height("12px");
      }
    });
  }
  handleProgessDrag() {
    var $arc = $("#progressarc");
    var initx = $("#progressBox").offset().left;
    var tot = $("#progressBox").width();
    var $container = $("#progressBox");
    var drag = false;
    $container.mousedown((e) => {
      drag = true;
      var curx = e.clientX;
      var progs = (curx - initx) / tot;
      if (drag && progs >= 0 && progs <= 1) {
        this.audio.pause();
        var t = this.state.current.Span * progs;
        this.setState(
          { currentTime: t },
          () => (this.audio.currentTime = this.state.currentTime)
        );
      }
    });
    $arc.mousedown(() => {
      drag = true;
    });
    $container.mousemove((e) => {
      var curx = e.clientX;
      var progs = (curx - initx) / tot;
      if (drag && progs >= 0 && progs <= 1) {
        this.audio.pause();
        var t = this.state.current.Span * progs;
        this.setState(
          { currentTime: t },
          () => (this.audio.currentTime = this.state.currentTime)
        );
      }
    });
    $container.mouseup(() => {
      if (drag) {
        drag = false;
        this.audio.play();
      }
    });
    $container.mouseleave(() => {
      if (drag) {
        this.audio.play();
        drag = false;
      }
    });
  }

  handleTimeUpdate() {
    this.setState({
      currentTime: this.audio.currentTime,
    });
  }
  render() {
    const { Span, MusicName, SingerName } = this.state.current;
    const { currentTime } = this.state;
    return (
      <div id="player_container" className={this.state.visible ? "p_show" : ""}>
        <div id="blur">
          <img
            src={this.state.current.ImagePath}
            style={{ height: "100%" }}
          ></img>
        </div>
        <div className="main">
          <div className="headBox">
            <h4 id="title" style={{ fontSize: "20px", fontWeight: "bold" }}>
              {MusicName}
            </h4>
            <h3 id="singer" style={{ fontSize: "16px" }}>
              {SingerName}
            </h3>
          </div>
          <div className="discBox" id="discBox">
            <div id="border" className={this.state.playing ? "rotate" : ""}>
              <Avatar
                className="disc"
                size={140}
                src={this.state.current.ImagePath}
              />
            </div>
          </div>
          <div className="controlBox" id="controlBox">
            <div className="progressBox" id="progressBox">
              <div
                className="progressBar"
                style={{ width: (currentTime / Span) * 100 + "%" }}
              >
                <span id="progressarc"></span>
              </div>
            </div>

            <div id="m_operate">
              <button className="operation">
                <i className="fa fa-heart-o fa-2x" aria-hidden="true"></i>
              </button>

              <button className="operation">
                <i className="fa fa-list fa-2x" aria-hidden="true"></i>
              </button>
              <button className="operation">
                <i className="fa fa-info-circle fa-2x" aria-hidden="true"></i>
              </button>
              <button id="favolumntag" className="operation">
                <i className="fa fa-volume-up fa-2x" aria-hidden="true"></i>
              </button>
              <div className="volume operation" id="volume">
                <div
                  className="volumebar"
                  id="volumebar"
                  style={{ width: this.state.volume * 100 + "%" }}
                >
                  <span id="volumearc"></span>
                </div>
              </div>
            </div>
            <div id="progress_container">
              {/* <div>
                {currentTime / 60 < 10
                  ? "0" + Math.floor(currentTime / 60)
                  : Math.floor(currentTime / 60)}
                :
                {currentTime % 60 < 10
                  ? "0" + Math.floor(currentTime % 60)
                  : Math.floor(currentTime % 60)}
              </div> */}

              {/* <div>
                {Span / 60 < 10
                  ? "0" + Math.floor(Span / 60)
                  : Math.floor(Span / 60)}
                :
                {Span % 60 < 10
                  ? "0" + Math.floor(Span % 60)
                  : Math.floor(Span % 60)}
              </div>*/}
            </div>

            <div className="prev m_action">
              <button onClick={this.handlePrev}>
                <i className="fa fa-step-backward fa-2x"></i>
              </button>
            </div>
            <div className="playBox m_action">
              {this.state.playing ? (
                <button onClick={() => this.audio.pause()}>
                  <i
                    className="fa fa-pause-circle fa-4x"
                    aria-hidden="true"
                  ></i>
                </button>
              ) : (
                <button onClick={this.handlePlay}>
                  <i className="fa fa-play-circle fa-4x"></i>
                </button>
              )}
            </div>
            <div className="next m_action">
              <button onClick={this.handleNext}>
                <i className="fa fa-step-forward fa-2x"></i>
              </button>
            </div>
          </div>
        </div>
        <div id="player_show">
          <span
            style={{
              position: "absolute",
              left: "5px",
              top: "3px",
              color: "#bdc3c7",
            }}
          >
            <button onClick={this.handleShow}>
              {this.state.visible ? (
                <i
                  className="fa fa-angle-double-up fa-2x"
                  aria-hidden="true"
                ></i>
              ) : (
                <i
                  className="fa fa-angle-double-down fa-2x"
                  aria-hidden="true"
                ></i>
              )}
            </button>
          </span>
          <span>
            {this.state.playing ? <>{MusicName} </> : <>暂无音乐播放</>}
          </span>
          {this.state.visible ? (
            ""
          ) : (
            <>
              <div className="playBox m_action">
                {this.state.playing ? (
                  <button onClick={() => this.audio.pause()}>
                    <i className="fa fa-pause " aria-hidden="true"></i>
                  </button>
                ) : (
                  <button onClick={this.handlePlay}>
                    <i className="fa fa-play"></i>
                  </button>
                )}
              </div>
              <div className="next m_action">
                <button onClick={this.handleNext}>
                  <i className="fa fa-step-forward"></i>
                </button>
              </div>
            </>
          )}
        </div>
        <audio
          id="audio"
          src={this.state.current.Path}
          onTimeUpdate={this.handleTimeUpdate}
          onEnded={this.handleNext}
          onVolumeChange={(e) =>
            this.setState({
              volume: this.audio.volume,
            })
          }
          onPlay={() => this.setState({ playing: true })}
          onPause={() => this.setState({ playing: false })}
        >
          你的浏览器不支持此播放器。
        </audio>
      </div>
    );
  }
}
export default Player;
