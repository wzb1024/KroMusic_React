import React, { Component } from "react";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Tag, Button, Drawer } from "antd";
import $ from "jquery";
import { Link } from "react-router-dom";
import { Avatar } from "antd";

class SearchIndex extends Component {
  constructor(props) {
    super();
    this.state = {
      history: [],
      songs: [],
      singers: [],
      playlists: [],
      visible: false,
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.clickHistory = this.clickHistory.bind(this);
    this.search = this.search.bind(this); //延迟ajax
    this.handleGetmore = this.handleGetmore.bind(this);
  }
  clear() {
    this.setState({
      singers: [],
      songs: [],
      playlists: [],
    });
  }
  search(keyword) {
    $("#result_box").slideDown();
    $("#more").show();
    $.getJSON(
      "/Music/Song/Search",
      { keywords: keyword },
      function (data) {
        this.setState({
          songs: data,
        });
      }.bind(this)
    );
    $.getJSON(
      "/Music/Singer/Search",
      { keywords: keyword },
      function (data) {
        this.setState({
          singers: data,
        });
      }.bind(this)
    );
    $.getJSON(
      "/Music/Playlist/Search",
      { keywords: keyword },
      function (data) {
        this.setState({
          playlists: data,
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
    $input.bind(
      "propertychange input",
      function (e) {
        var keyword = e.target.value;
        if (keyword != "") {
          if (timer != null) clearTimeout(timer);
          timer = setTimeout(() => {
            this.search(keyword);
          }, 300);
        } else {
          $("#result_box").slideUp("fast");
          this.clear();
        }
      }.bind(this)
    );
    $input.focus(function () {
      $icon.fadeOut();
      $("#search_btn").css("visibility", "visible");
      $search.animate({
        width: "600px",
        borderRadius: "40px",
      });
    });
    $input.blur(
      function () {
        $("#search_btn").css("visibility", "hidden");
        if (timer != null) clearTimeout(timer);
        $input.val("");
        $("#result_box").slideUp("fast");
        this.clear();
        $icon.fadeIn();
        $search.animate({
          width: "260px",
          borderRadius: "15px",
        });
      }.bind(this)
    );

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
  handleGetmore() {
    this.setState({ visible: true });
  }
  render() {
    const playlists = [];
    const singers = [];
    const songs = [];
    this.state.playlists.forEach((item, i) => {
      if (i < 5) {
        playlists.push(
          <li key={item.Id}>
            <Link
              to={ "/playlist/"+ item.Id }
              onClick={() => this.handleSearch(item.Name)}
            >
              <span>{item.Name}</span>
            </Link>
          </li>
        );
      }
    });
    this.state.singers.forEach((item, i) => {
      if (i < 5) {
        singers.push(
          <li key={item.id}>
            <Link
              to={"/singer/"+ item.Id }
              onClick={() => this.handleSearch(item.Name)}
            >
              <span>{item.Name}</span>
              <span>
                <Avatar src={item.Owner} size="small" icon={<UserOutlined />} />
              </span>
            </Link>
          </li>
        );
      }
    });
    this.state.songs.forEach((item, i) => {
      if (i < 5) {
        songs.push(
          <li key={item.Id}>
            <Link
              to={"/song/"+ item.Id }
              onClick={() => this.handleSearch(item.Name)}
            >
              <span>{item.Name}</span>
              <span>{item.Owner}</span>
            </Link>
          </li>
        );
      }
    });

    return (
      <div id="search-container">
        <Drawer
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
        </Drawer>
        <div id="search_box">
          <SearchOutlined className="search_icon" />
          <input
            type="text"
            id="search_input"
            onKeyPress={(e) => {
              if (e.target.value != "" && event.keyCode == 13) {
                this.handleGetmore();
              }
            }}
          />
        </div>
        <div id="result_box">
          <div id="search-result-songs">
            <h4>歌曲</h4>
            <ul>
              {songs.length == 0 ? (
                <li>
                  <span>未找到相关歌曲</span>
                </li>
              ) : (
                songs
              )}
            </ul>
          </div>
          <div id="search-result-singers">
            <h4>歌手</h4>
            <ul>
              {singers.length == 0 ? (
                <li>
                  <span>未找到相关歌手</span>
                </li>
              ) : (
                singers
              )}
            </ul>
          </div>
          <div id="search-result-playlists">
            <h4>歌单</h4>
            <ul>
              {playlists.length == 0 ? (
                <li>
                  <span>未找到相关歌单</span>
                </li>
              ) : (
                playlists
              )}
            </ul>
          </div>
          <div></div>
        </div>
        <div id="search-section">
          <div id="searc-history">
            <div
              style={{
                display: "inline-block",
                fontSize: "15px",
                fontWeight: "bold",
                color: "rgba(0, 0, 0, 0.5)",
                marginRight: "6px",
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
