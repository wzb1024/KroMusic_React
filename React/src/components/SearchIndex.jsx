import React, { Component } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import $ from "jquery";
import { Link } from "react-router-dom";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

class SearchIndex extends Component {
  constructor(props) {
    super();
    this.state = {
      history: [],
      songs: [],
      singers: [],
      playlists: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.clickHistory = this.clickHistory.bind(this);
    this.search = this.search.bind(this); //延迟ajax
  }
  search(keyword) {
    //查询歌曲
    $("#result_box").slideDown();
    $.getJSON(
      "/Music/Song/Search",
      { keywords: keyword },
      function(data) {
        this.setState({
          songs: data
        });
      }.bind(this)
    );
    //查询是否存在歌手
    $.getJSON(
      "/Music/Singer/Search",
      { keywords: keyword },
      function(data) {
        this.setState({
          singers: data
        });
      }.bind(this)
    );
    //查询是否存在歌单
    $.getJSON(
      "/Music/Playlist/Search",
      { keywords: keyword },
      function(data) {
        this.setState({
          playlists: data
        });
      }.bind(this)
    );
  }
  componentDidMount() {
    var $input = $("#search_input");
    var $search = $("#search_box");
    var $icon = $(document.getElementsByClassName("search_icon")[0]);
    $icon.click(function() {
      $input.focus();
    });
    var timer = null; //定义定时器
    $input.bind(
      "propertychange input",
      function(e) {
        var keyword = e.target.value;
        if (keyword != "") {
          if (timer != null) clearTimeout(timer);
          timer = setTimeout(() => {
            this.search(keyword);
          }, 500);
        } else {
          $("#result_box").slideUp();
        }
      }.bind(this)
    );
    $input.focus(function() {
      $icon.fadeOut();
      $search.animate({
        width: "600px",
        borderRadius: "40px"
      });
    });
    $input.blur(function() {
      $input.val("");
      $("#result_box").slideUp();
      $icon.fadeIn();
      $search.animate({
        width: "260px",
        borderRadius: "15px"
      });
    });

    $.getJSON(
      "/Search/GetHistory",
      function(result) {
        if (result.State) {
          this.setState({
            history: result.History
          });
        }
      }.bind(this)
    );
  }
  handleSearch(value) {
    $.ajax("/Search/AddHistory", {
      data: { keyword: value }
    });
  }
  clickHistory(value) {
    $("#search_input").focus();
    $("#search_input").val(value);
    this.search(value)
  }
  // handleTagDelete(key) {
  //   $.ajax("/Search/Delete", {
  //     data:{key:key}     
  //   });

  // }
  clearHistory() {
    $.ajax("/Search/Clear", {
      success: function() {
        $("#searc-history ul").slideUp(300);
        this.setState({history:[]})
      }.bind(this)
    });
  }
  render() {
    return (
      <div id="search-container">
        <div id="search_box">
          <SearchOutlined className="search_icon" />
          <input type="text" id="search_input" />
        </div>
        <div id="result_box">
          <div id="search-result-songs">
            <h4>歌曲</h4>
            <ul>
              {this.state.songs.map(item => (
                <li key={item.Id}>
                  <Link
                    to={{ pathname: "/song", state: { id: item.Id } }}
                    onClick={() => this.handleSearch(item.Name)}
                  >
                    <span>{item.Name}</span>
                    <span>{item.Owner}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div id="search-result-singers">
            <h4>歌手</h4>
            <ul>
              {this.state.singers.map(item => (
                <Link
                  to={{ pathname: "/singer", state: { id: item.Id } }}
                  onClick={() => this.handleSearch(item.Name)}
                >
                  <span>{item.Name}</span>
                  <span>
                    <Avatar
                      src={item.Owner}
                      size="small"
                      icon={<UserOutlined />}
                    />
                  </span>
                </Link>
              ))}
            </ul>
          </div>
          <div id="search-result-playlists">
            <h4>歌单</h4>
            <ul>
              {this.state.playlists.map(item => (
                <li key={item.Id}>
                  <Link
                    to={{ pathname: "/playlist", state: { id: item.Id } }}
                    onClick={() => this.handleSearch(item.Name)}
                  >
                    <span>{item.Name}</span>
                    <span>{item.Owner}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="search-section">
          <div id="searc-history">
            <div style={{fontSize:"15px",fontWeight:"bold",color:"rgba(0, 0, 0, 0.5)"}}>历史搜索</div>
            {this.state.history.length > 0 ? (
              <button className="tag" onClick={this.clearHistory}>清除</button>
            ) : (
              <></>
            )}
            <ul>
              {this.state.history.map(item => (
                <li>
                  <Tag
                    key={item.Key}              
                  >
                    {item.Value}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
          <div id="search-pop-song">
            <div style={{fontSize:"15px",fontWeight:"bold",color:"rgba(0, 0, 0, 0.5)"}}>热门歌曲</div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchIndex;
