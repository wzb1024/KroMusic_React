import React, { Component } from "react";
import { Avatar, message } from "antd";
import $ from "jquery";

class Player extends Component {
  constructor(progs) {
    super(progs);
    
    this.state = {
      visible: false,
      url: "",
      mlist: progs.list,
      current: {
        index: 0,
        title: "暂无可播放音乐",
        singer: "",
        favorate: false,
        totalTime: 0,
        currentTime: 0,
        img: "",
        url: "",
        volume: 0,
      },
      playing: false,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handelTimeUpdate = this.handelTimeUpdate.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleProgessDrag = this.handleProgessDrag.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleVolumeDrag = this.handleVolumeDrag.bind(this);
  }
  static addToList(list) {
    var mlist = this.state.mlist.concat(result); //去重
    var s = new Set(mlist);
    var l = Array.from(s);
    this.setState({
      mlist: l,
    });
  }
  handlePlay(mid) {
    var l = [mid];
    this.addToList(l);
    var audio = document.getElementById("audio");
    setTimeout(() => audio.play(), 100);
  }
  handleProgessDrag() {
    var $arc = $("#progressarc");
    var initx = $("#progressBox").offset().left;
    var tot = $("#progressBox").width();
    var $container = $("#player_container");
    var drag = false;
    $arc.mousedown(() => {
      drag = true;
      $arc.width("20px").height("20px");
    });
    $container.mousemove((e) => {
      var curx = e.clientX;
      var progs = (curx - initx) / tot;
      if (drag && progs >= 0 && progs <= 1) {
        var t = this.state.current;
        t.currentTime = t.totalTime * progs;
        this.setState(
          { current: t },
          () => (this.audio.currentTime = this.state.current.currentTime)
        );
      }
    });
    $container.mouseup(() => {
      if (drag) {
        drag = false;
        $arc.width("16px").height("16px");
      }
    });
    $container.mouseleave(() => {
      if (drag) {
        drag = false;
        $arc.width("16px").height("16px");
      }
    });
  }
  componentDidMount() {
    this.audio = document.getElementById("audio");
    var t = this.state.current;
    t.volume = this.audio.volume;
    this.setState({
      current: t,
    });
    $("#favolumntag").click(function () {
      $("#volume").hasClass("v_show")
        ? $("#volume").removeClass("v_show")
        : $("#volume").addClass("v_show");
    });
    this.handleProgessDrag();
    this.handleVolumeDrag();
    if (this.state.mlist.length > 0) {
      var m = this.state.mlist[0];
      var t = this.state.current;
      t.url = m.url;
      t.title = m.title;
      t.totalTime = m.totalTime;
      t.singer = m.singer;
      t.img = m.img;
      t.index = 0;
      t.currentTime = 0;
      this.setState({
        current: t,
      });
    }
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
    if (this.state.mlist.length > 0) {
      this.setState({ playing: true });
      this.audio.play();
    } else {
      message.error("暂无可播放音乐");
    }
  }
  handlePause() {
    this.setState({ playing: false });
    this.audio.pause();
  }
  handelTimeUpdate() {
    var time = event.target.currentTime;
    var current = this.state.current;
    current.currentTime = time;
    this.setState({
      current: current,
    });
  }
  handlePrev() {
    this.setState({ playing: false }, () => this.audio.pause());
    var index = this.state.current.index;
    var list = this.state.mlist;
    var len = list.length;
    var t = this.state.current;
    var m = null;
    if (index > 0) {
      m = list[index - 1];
      t.index = index - 1;
    } else {
      m = list[len - 1];
      t.index = len - 1;
    }
    t.url = m.url;
    t.title = m.title;
    t.totalTime = m.totalTime;
    t.singer = m.singer;
    t.img = m.img;
    t.index = 0;
    t.currentTime = 0;
    this.setState(
      {
        playing: true,
        current: t,
      },
      () => this.audio.play()
    );
  }

  handleNext() {
    this.setState({ playing: false }, () => this.audio.pause());
    var index = this.state.current.index;
    var list = this.state.mlist;
    var t = this.state.current;
    var m = null;
    var len = list.length;
    if (index < len - 1) {
      m = list[index + 1];
      t.index = index + 1;
    } else {
      m = list[0];
      t.index = 0;
    }
    t.url = m.url;
    t.title = m.title;
    t.totalTime = m.totalTime;
    t.singer = m.singer;
    t.img = m.img;
    t.index = 0;
    t.currentTime = 0;
    this.setState(
      {
        playing: true,
        current: t,
      },
      () => this.audio.play()
    );
  }
  handleVolumeChange() {
    var valume = event.target.valume;
    var current = this.state.current;
    current.valume = valume;
    this.setState({
      current: current,
    });
  }
  handleVolumeDrag() {
    var $arc = $("#volumearc");
    var drag = false;
    var inity = $("#volume").offset().top;
    var tot = $("#volume").height();
    var $container = $("#player_container");
    $arc.mousedown(() => {
      drag = true;
      $arc.width("14px").height("14px");
    });
    $container.mousemove((e) => {
      var cury = e.clientY;
      var progs = 1 - (cury - inity) / tot;
      if (drag && progs >= 0 && progs <= 1) {
        var t = this.state.current;
        t.volume = progs;
        this.setState(
          { current: t },
          () => (this.audio.volume = this.state.current.volume)
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

  render() {
    const {
      currentTime,
      totalTime,
      volume,
      title,
      singer,
    } = this.state.current;
    return (
      <div id="player_container" className={this.state.visible ? "p_show" : ""}>
        <div
          id="blur"
          style={{
            backgroundImage: "url(" + this.state.url + ")",
            backgroundSize: "cover",
          }}
        ></div>
        <div id="player_show" onClick={this.handleShow}>
          正在播放
        </div>
        <div className="main">
          <div className="headBox clearfix">
            <h4 id="title" style={{ fontSize: "20px", fontWeight: "bold" }}>
              {title}
            </h4>
            <h3 id="singer" style={{ fontSize: "16px" }}>
              {singer}
            </h3>
          </div>
          <div className="discBox">
            <div className="border">
              <Avatar className="disc" size={140} src="" />
            </div>
          </div>
          <div className="controlBox">
            <div className="volume" id="volume">
              <div
                className="volumebar"
                id="volumebar"
                style={{ height: volume * 100 + "%" }}
              >
                <span id="volumearc"></span>
              </div>
            </div>
            <div id="m_operate">
              <button id="favolumntag">
                <i className="fa fa-volume-up fa-2x" aria-hidden="true"></i>
              </button>
              <button>
                <i className="fa fa-heart-o fa-2x" aria-hidden="true"></i>
              </button>

              <button>
                <i className="fa fa-list fa-2x" aria-hidden="true"></i>
              </button>
              <button>
                <i className="fa fa-info-circle fa-2x" aria-hidden="true"></i>
              </button>
            </div>
            <div className="progressBox" id="progressBox">
              <div
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: "-50px",
                  fontSize: "14px",
                }}
                id="curTime"
              >
                {currentTime / 60 < 10
                  ? "0" + Math.floor(currentTime / 60)
                  : Math.floor(currentTime / 60)}
                :
                {currentTime % 60 < 10
                  ? "0" + Math.floor(currentTime % 60)
                  : Math.floor(currentTime % 60)}
              </div>
              <div
                className="progressBar"
                style={{ width: (currentTime / totalTime) * 100 + "%" }}
              >
                <span id="progressarc"></span>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  right: "-45px",
                  fontSize: "14px",
                }}
                id="totalTime"
              >
                {totalTime / 60 < 10
                  ? "0" + Math.floor(totalTime / 60)
                  : Math.floor(totalTime / 60)}
                :
                {totalTime % 60 < 10
                  ? "0" + Math.floor(totalTime % 60)
                  : Math.floor(totalTime % 60)}
              </div>
            </div>
            <div className="prev m_action">
              <button onClick={this.handlePrev}>
                <i className="fa fa-step-backward fa-2x"></i>
              </button>
            </div>
            <div className="playBox m_action">
              {this.state.playing ? (
                <button onClick={this.handlePause}>
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
        <audio
          id="audio"
          src={this.state.current.url}
          onTimeUpdate={this.handelTimeUpdate}
          onEnded={this.handleNext}
          onVolumeChange={this.handleVolumeChange}
        >
          你的浏览器不支持此播放器。
        </audio>
      </div>
    );
  }
}
export default Player;
