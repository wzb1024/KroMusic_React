import React, { Component } from "react";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Tag, Button, Drawer } from "antd";
import $ from "jquery";
import { Link } from "react-router-dom";
import { Avatar } from "antd";
import { Pagination } from "antd";

class SearchIndex extends Component {
  constructor(props) {
    super();
    this.state = {
      history: [],
      songs: [],
      singers: [],
      playlist: {
        total: 0,
        pageIndex: 1,
        result: [],
      },
      visible: false,
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.clickHistory = this.clickHistory.bind(this);
    this.handlePlaylistPageChange = this.handlePlaylistPageChange.bind(this);
    this.search = this.search.bind(this); //延迟ajax
    //this.handleGetmore = this.handleGetmore.bind(this);
  }
  clear() {
    this.setState({
      singers: [],
      songs: [],
      playlists: [],
    });
  }
  search(keyword) {
    //$("#result_box").slideDown();
    $.getJSON(
      "/Music/Song/Search",
      { keywords: keyword, pageIndex: 1 },
      function (data) {
        this.setState({
          songs: data,
        });
      }.bind(this)
    );
    $.getJSON(
      "/Music/Singer/Search",
      { keywords: keyword, pageIndex: 1 },
      function (data) {
        this.setState({
          singers: data,
        });
      }.bind(this)
    );
    $.getJSON(
      "/Music/Playlist/Search",
      { keywords: keyword, pageIndex: 1 },
      function (data) {
        var model = this.state.playlist;
        model.result = data.List;
        model.total = data.Total;
        this.setState({
          playlist: model,
        });
      }.bind(this)
    );
  }
  componentDidMount() {
    var $input = $("#search_input");
    var $search = $("#search_box");
    var $icon = $(document.getElementsByClassName("search_icon")[0]);

    $icon.click(function () {
      $input.focus();
    });
    var timer = null; //定义定时器
    var timeOut = null;
    $input.bind(
      "propertychange input",
      function (e) {
        var keyword = e.target.value;
        if (keyword != "") {
          if (timer != null) clearTimeout(timer);
          timer = setTimeout(() => {
            $("#search_blur").addClass("active");
            timeOut = setTimeout(
              () => $("#result_box").addClass("active"),
              500
            );

            $search.animate({
              top: "20px",
            });
            this.search(keyword);
          }, 300);
        } else {
          if (timer != null) clearTimeout(timer);
          if (timeOut != null) clearTimeout(timeOut);
          $("#search_blur").removeClass("active");
          $("#result_box").removeClass("active");
          $search.animate({
            top: "180px",
          });
          $("#result_box").slideUp("fast");
          this.clear();
        }
      }.bind(this)
    );
    $input.blur(function () {
      if (!$("#result_box").hasClass("active")) {
        $search.animate({
          width: "260px",
          borderRadius: "15px",
        });
        $icon.css("display", "block");
      }
    });
    $input.focus(function () {
      $icon.css("display", "none");

      $search.animate({
        width: "600px",
        borderRadius: "40px",
      });
    });
    $.getJSON(
      "/Search/GetHistory",
      function (result) {
        if (result.State) {
          this.setState({
            history: result.History,
          });
        }
      }.bind(this)
    );
  }
  handleSearch(value) {
    $.ajax("/Search/AddHistory", {
      data: { keyword: value },
    });
  }
  clickHistory(value) {
    $("#search_input").focus();
    $("#search_input").val(value);
    this.search(value);
  }
  handleTagDelete(key) {
    $.ajax("/Search/Delete", {
      data: { key: key },
    });
  }
  clearHistory() {
    $.ajax("/Search/Clear", {
      success: function () {
        $("#searc-history ul").slideUp(300);
        this.setState({ history: [] });
      }.bind(this),
    });
  }
  handlePlaylistPageChange(page, pageSize) {
    $.getJSON(
      "/Music/Playlist/GetPlaylists",
      {
        id: this.state.currentTypeId,
        pageIndex: page,
        orderByHeat: this.state.popsort,
      },
      function (data) {
        this.setState({
          pageIndex: page,
          playlists: data.Playlists,
          total: data.Total,
        });
      }.bind(this)
    );
  }
  // handleGetmore() {
  //   this.setState({ visible: true });
  //}
  render() {
    return (
      <div id="search-container">
        <div id="search_blur"></div>
        {/* <Drawer
          getContainer={false}
          height="100%"
          zIndex={8}
          placement="top"
          style={{ position: "absolute" }}
          closable={true}
          onClose={() => {
            this.setState({
              visible: false,
            });
          }}
          visible={this.state.visible}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer> */}
        <div id="search_box">
          <SearchOutlined className="search_icon" />
          <input
            type="text"
            id="search_input"
            onKeyPress={(e) => {
              if (e.target.value != "" && event.keyCode == 13) {
                this.search(e.target.value);
              }
            }}
          />
        </div>
        <div id="result_box">
          <div id="search-result-songs">
            <h4>相关歌曲</h4>
            <ul>
              {this.state.songs.length == 0 ? (
                <li>
                  <span>未找到相关歌曲</span>
                </li>
              ) : (
                this.state.songs.map((item, i) => {
                  if (i < 5) {
                    return (
                      <Link
                        to={"/song/" + item.Id}
                        onClick={() => this.handleSearch(item.Name)}
                      >
                        <li key={item.Id}>
                          <span>{item.Name}</span>
                          <span>{item.Owner}</span>
                        </li>
                      </Link>
                    );
                  }
                })
              )}
            </ul>
          </div>
          <div id="search-result-singers">
            <h4>相关歌手</h4>
            <ul>
              {this.state.singers.length == 0 ? (
                <li>
                  <span>未找到相关歌手</span>
                </li>
              ) : (
                this.state.singers.map((item, i) => {
                  if (i < 5) {
                    return (
                      <Link
                        to={"/singer/" + item.Id}
                        onClick={() => this.handleSearch(item.Name)}
                      >
                        <li key={item.id}>
                          <span>{item.Name}</span>
                          <span>
                            <Avatar
                              src={item.Owner}
                              size="small"
                              icon={<UserOutlined />}
                            />
                          </span>
                        </li>
                      </Link>
                    );
                  }
                })
              )}
            </ul>
          </div>
          <div id="search-result-playlists">
            <h4>相关歌单</h4>
            <ul>
              {this.state.playlist.result.length == 0 ? (
                <li>
                  <span>未找到相关歌单</span>
                </li>
              ) : (
                <>
                  <li>
                    <span>歌单名</span>
                    <span style={{ float: "right", fontSize: "13px" }}>
                      创建者
                    </span>
                  </li>
                  {this.state.playlist.result.map((item, i) => {
                    return (
                      <Link
                        to={"/playlist/" + item.Id}
                        onClick={() => this.handleSearch(item.Name)}
                      >
                        <li key={item.Id}>
                          <span>{item.Name}</span>
                          <span style={{ float: "right", fontSize: "13px" }}>
                            {item.Owner}
                          </span>
                        </li>
                      </Link>
                    );
                  })}
                </>
              )}
            </ul>
            <Pagination
              hideOnSinglePage={true}
              defaultPageSize={15}
              simple
              defaultCurrent={1}
              current={this.state.playlist.pageIndex}
              total={this.state.playlist.total}
              onChange={this.handlePlaylistPageChange}
            />
          </div>
        </div>
        <div id="search-section">
          <div id="searc-history">
            <div
              style={{
                display: "inline-block",
                fontSize: "15px",
                fontWeight: "bold",
                color: "rgba(0, 0, 0, 0.5)",
                marginRight: "15px",
              }}
            >
              历史搜索
            </div>
            {this.state.history.length > 0 ? (
              <button className="tag" onClick={this.clearHistory}>
                清除
              </button>
            ) : (
              <></>
            )}
            <ul>
              {this.state.history.map((item) => (
                <li key={item.Key}>
                  <Tag
                    style={{ cursor: "pointer" }}
                    onClick={() => this.clickHistory(item.Value)}
                  >
                    {item.Value}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
          <div id="search-pop-song">
            <div
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                color: "rgba(0, 0, 0, 0.5)",
              }}
            >
              热门歌曲
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchIndex;
