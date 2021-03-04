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
    this.handleInput = this.handleInput.bind(this);

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
  handleInput(keyword) {
    var $search = $("#search_box");
    if (keyword != "") {
      $("#search_blur").addClass("active");
      setTimeout(() => $("#result_box").addClass("active"), 500);

      $search.animate({
        top: "20px",
      });
      this.search(keyword);
    } else {
      console.log(keyword);
      $("#search_blur").removeClass("active");
      $("#result_box").removeClass("active");
      $search.animate({
        top: "180px",
      });
      $("#result_box").slideUp("fast");
      this.clear();
    }
  }
  blur() {
    if (!$("#result_box").hasClass("active")) {
      $("#search_box").animate({
        width: "260px",
        borderRadius: "15px",
      });
      $(document.getElementsByClassName("search_icon")[0]).css(
        "display",
        "block"
      );
    }
  }
  focus() {
    $(document.getElementsByClassName("search_icon")[0]).css("display", "none");

    $("#search_box").animate({
      width: "600px",
      borderRadius: "40px",
    });
  }
  componentDidMount() {
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
    $("#search_input").val(value);
    this.handleInput(value);
    $("#search_input").focus();
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
        <div id="search_box">
          <input
            type="text"
            id="search_input"
            onChange={(e) => this.handleInput(e.target.value)}
            onBlur={this.blur}
            onFocus={this.focus}
          />
          <SearchOutlined
            className="search_icon"
            onClick={() => $("#search_input").focus()}
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
                <>
                  <span
                    style={{
                      width: "180px",
                      display: "inline-block",
                      fontSize: "initial",
                      marginLeft: "10px",
                    }}
                  >
                    歌曲名
                  </span>
                  <span style={{ fontSize: "initial" }}>歌手</span>
                  {this.state.songs.map((item, i) => {
                    if (i < 5) {
                      return (
                        <Link
                          to={"/song/" + item.Id}
                          onClick={() => this.handleSearch(item.Name)}
                        >
                          <li key={item.Id}>
                            <span
                              style={{
                                width: "180px",
                                display: "inline-block",
                              }}
                            >
                              {item.Name}
                            </span>
                            <span>{item.Owner}</span>
                          </li>
                        </Link>
                      );
                    }
                  })}
                </>
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
                        <li
                          key={item.id}
                          style={{ textAlign: "center", padding: "5px" }}
                        >
                          <span>
                            <Avatar
                              src={item.Owner}
                              size="middle"
                              icon={<UserOutlined />}
                            />
                          </span>
                          <span
                            style={{ marginLeft: "35px", fontSize: "initial" }}
                          >
                            {item.Name}
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
                  <span
                    style={{
                      width: "180px",
                      display: "inline-block",
                      fontSize: "initial",
                      marginLeft: "10px",
                    }}
                  >
                    歌单名
                  </span>
                  <span style={{ fontSize: "initial" }}>创建者</span>

                  {this.state.playlist.result.map((item, i) => {
                    return (
                      <Link
                        to={"/playlist/" + item.Id}
                        onClick={() => this.handleSearch(item.Name)}
                      >
                        <li key={item.Id}>
                          <span
                            style={{ width: "180px", display: "inline-block" }}
                          >
                            {item.Name}
                          </span>
                          <span>{item.Owner}</span>
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
        </div>
      </div>
    );
  }
}

export default SearchIndex;
