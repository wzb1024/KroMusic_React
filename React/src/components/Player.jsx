import React, { Component } from "react";
import { Avatar, message } from "antd";
import $ from "jquery";
import { Link } from "react-router-dom";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      mlist: [],
      current: {
        Id: -1,
        MusicName: "暂无可播放音乐",
        SingerName: "",
        Favorite: false,
        Span: 1,
        ImagePath: "",
        Path: "",
      },
      showList: false,
      currentTime: 0,
      index: 0,
      volume: 0,
      playing: false,
    };

    this.props.onRef(this);

    this.handleShow = this.handleShow.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleProgessDrag = this.handleProgessDrag.bind(this);
    this.handleVolumeDrag = this.handleVolumeDrag.bind(this);
    this.playSingle = this.playSingle.bind(this);
    this.removeSingle = this.removeSingle.bind(this);
    this.handleEmpty = this.handleEmpty.bind(this);
    this.init = this.init.bind(this);
    this.handleListChange = this.handleListChange.bind(this);
    this.handleCollect = this.handleCollect.bind(this);
  }
  //对象数组去重
  // removeRepeat(list) {
  //   var obj = {};
  //   list = list.reduce(function (item, next) {
  //     obj[next.Id] ? "" : (obj[next.Id] = true && item.push(next));
  //     return item;
  //   }, []);
  //   return list;
  // }
  // shouldComponentUpdate(nextProps,nextState){
  //   console.log(nextState,this.state)
  //   return  !(nextProps.updateList==this.props.updateList)
  // }
  componentDidMount() {
    this.audio = document.getElementById("audio");
    this.audio.volume = 0.4;
    this.setState({
      volume: this.audio.volume,
    });
    $("#favolumntag").click(
      function () {
        if (this.state.volume == 0) {
          this.audio.volume = 0.4;
          this.setState({
            volume: 0.4,
          });
        } else {
          this.audio.volume = 0;
          this.setState({
            volume: 0,
          });
        }
      }.bind(this)
    );
    this.handleProgessDrag();
    this.handleVolumeDrag();
    if (this.state.mlist.length == 0) {
      this.handleEmpty();
    }
  }
  addToList(list, play = false) {
    this.init(list, play);
  }

  init(list, play) {
    list.forEach((item, i) => {
      if (item === this.state.current.Id) list.splice(i, 1);
    });
    if (list.length == 0) return;
    $.ajax("/music/song/GetSongsList", {
      data: { list: list },
      dataType: "json",
      traditional: true,
      success: function (result) {
        this.handleListChange(result, play);
      }.bind(this),
    }); //异步！！！
  }
  handleListSlide() {
    const exheight = $("#listBox").height();
    const totheight = $("#list_ul").height();
    if (totheight > exheight) {
      const inity = $("#listBox").offset().top;
      $("#listBox").mousemove(function (e) {
        let span = totheight - exheight;
        let rate = (e.clientY - inity) / exheight;
        let distance = "-" + rate * span + "px";
        $("#list_ul").css("top", distance);
      });
    }
  }
  handleListChange(result, play) {
    var updateList = result;
    //var list = this.getDifferenceSet(this.state.mlist, updateList);   无法赋值？？？
    var getDifferenceSet = function (arr1, arr2) {
      arr1 = arr1.map(JSON.stringify);
      arr2 = arr2.map(JSON.stringify);
      return arr1
        .filter(function (v, i, arr) {
          return !arr2.includes(v);
        })
        .map(JSON.parse);
    };
    var list = getDifferenceSet(this.state.mlist, updateList);
    let index = list
      .map(JSON.stringify)
      .indexOf(JSON.stringify(this.state.current));
    if (index == -1) {
      list = updateList.concat(list);
      this.setState(
        {
          current: list[0],
          index: 0,
          currentTime: 0,
          mlist: list,
        },
        () => {
          if (play) this.handlePlay();
          setTimeout(this.handleListSlide, 300);
        }
      );
    } else {
      var i = index;
      updateList.forEach((item) => {
        list.splice(i + 1, 0, item);
        i++;
      });
      this.setState(
        {
          index: index,
          mlist: list,
        },
        () => {
          if (play) this.handleNext();
          setTimeout(this.handleListSlide, 300);
        }
      );
    }
  }

  // componentDidUpdate(prevProps, provState) {
  //   // let updateList = prevProps.updateList;
  //   // let play = prevProps.play;
  //   // if (updateList.length>0) this.init(updateList, play);
  //   const exheight = $("#listBox").height();
  //   const totheight = $("#list_ul").height();
  //   if (totheight > exheight) {
  //     const inity = $("#listBox").offset().top;
  //     $("#listBox").mousemove(function (e) {
  //       let span = totheight - exheight;
  //       let rate = (e.clientY - inity) / exheight;
  //       let distance = "-" + rate * span + "px";
  //       $("#list_ul").css("top", distance);
  //     });
  //   }
  // }
  // componentWillReceiveProps(nextProps) {
  //   let updateList = Array.from(nextProps.updateList);
  //   if (updateList.length > 0) this.init(updateList);
  // }
  //对象数组差集
  // getDifferenceSet(arr1, arr2) {
  //   arr1 = arr1.map(JSON.stringify);
  //   arr2 = arr2.map(JSON.stringify);
  //   return arr1
  //     .filter(function (v, i, arr) {
  //       return !arr2.includes(v);
  //     })
  //     .map(JSON.parse);
  // }

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
  handleEmpty() {
    let cur = {
      Id: -1,
      MusicName: "暂无可播放音乐",
      SingerName: "",
      Favorite: false,
      Span: 1,
      ImagePath: "",
      Path: "",
    };
    this.setState({
      index: -1,
      currentTime: 0,
      current: cur,
      playing: false,
    });
  }
  handlePlay() {
    if (this.state.mlist.length > 0) {
      this.audio.play();
    } else {
      this.handleEmpty();
      message.error("暂无可播放音乐");
    }
  }

  handlePrev() {
    if (this.state.mlist.length > 0) {
      this.audio.pause();
      var index = this.state.index;
      var list = this.state.mlist;
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
      this.handleEmpty();
      message.error("暂无可播放音乐");
    }
  }

  handleNext() {
    if (this.state.mlist.length > 0) {
      this.audio.pause();
      let index = this.state.index;
      var list = this.state.mlist;
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
      this.handleEmpty();
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
  playSingle(index) {
    let cur = this.state.mlist[index];
    this.setState(
      {
        current: cur,
        index: index,
      },
      () => this.handlePlay()
    );
  }

  removeSingle(index) {
    if (index == this.state.index) {
      this.handleNext();
    }
    this.setState(
      {
        mlist: this.state.mlist.filter((item, i) => index !== i),
      },
      () => {
        this.handleListSlide();
        let i = -1;
        let j = 0;
        while (j < this.state.mlist.length) {
          if (this.state.mlist[j].Id == this.state.current.Id) {
            i = j;
            break;
          }
          j++;
        }
        this.setState({
          index: i,
        });
      }
    );
  }
  handleCollect() {
    if (this.state.current.Id < 0) {
      message.error("请添加音乐");
      return;
    }
    $.getJSON(
      "/Music/Song/SongCollect",
      {
        id: this.state.current.Id,
      },
      function (result) {
        if (result.State) {
          var cur = this.state.current;
          if (result.Collected) {
            cur.Favorite = true;
          } else {
            cur.Favorite = false;
          }
          this.setState({
            current: cur,
          });
          message.success(result.Message);
        } else {
          message.error(result.Message);
        }
      }.bind(this)
    );
  }
  render() {
    const { Span, MusicName, SingerName } = this.state.current;
    const { currentTime } = this.state;
    return (
      <div id="player_container" className={this.state.visible ? "p_show" : ""}>
        <div id="blur" className="blur">
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
          {this.state.showList ? (
            <div
              id="listBox"
              className="discBox"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <ul id="list_ul">
                {this.state.mlist.map((item, i) => (
                  <li
                    className="listItem"
                    key={item.Id}
                    style={
                      i == this.state.index
                        ? { color: "#7bed9f" }
                        : { color: "#fafafa" }
                    }
                  >
                    <span onClick={() => this.playSingle(i)}>
                      {item.MusicName}
                    </span>
                    <i
                      className="fa fa-times listDelete"
                      aria-hidden="true"
                      onClick={() => this.removeSingle(i)}
                    ></i>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="discBox">
              <div id="border" className={this.state.playing ? "rotate" : ""}>
                <Avatar
                  className="disc"
                  size={140}
                  src={this.state.current.ImagePath}
                />
              </div>
            </div>
          )}
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
              <button className="operation" onClick={this.handleCollect}>
                {this.state.current.Favorite ? (
                  <i
                    class="fa fa-heart  fa-2x"
                    style={{ color: "#ff7875" }}
                    aria-hidden="true"
                  ></i>
                ) : (
                  <i className="fa fa-heart-o fa-2x" aria-hidden="true"></i>
                )}
              </button>

              <button
                className="operation"
                onClick={() => {
                  if (this.state.showList) {
                    this.setState({
                      showList: false,
                    });
                  } else {
                    this.setState({
                      showList: true,
                    });
                  }
                }}
              >
                <i className="fa fa-list fa-2x" aria-hidden="true"></i>
              </button>
              <button className="operation">
                <Link to={"/song/" + this.state.current.Id}>
                  {" "}
                  <i className="fa fa-info-circle fa-2x" aria-hidden="true"></i>
                </Link>
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
