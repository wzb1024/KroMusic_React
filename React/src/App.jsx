import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  jsHistory,
  Link,
  NavLink,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import AccountNav from "@/components/AccountNav";
import Player from "@/components/Player";
import router from "@/Router";
import Home from "@/components/HomeIndex";
import Search from "@/components/SearchIndex";
import SignUp from "@/components/SignUp";
import Category from "@/components/CategoryIndex";
import Account from "@/components/Account";
import Playlist from "@/components/Playlist";
import $ from "jquery";
class App extends Component {
  constructor() {
    super();
    this.state = {
      homeIndex: true,
      mlist: [
        {
          Id: 7,
          MusicName: "郭燕 - 天空之城 (钢琴版)",
          SingerName: "Fall Out Boy",
          Path:
            "https://oss.krokro.top/music/%E9%83%AD%E7%87%95%20-%20%E5%A4%A9%E7%A9%BA%E4%B9%8B%E5%9F%8E%20%28%E9%92%A2%E7%90%B4%E7%89%88%29.mp3",
          ImagePath: "\\Sourse\\MusicCover\\20200319191256.jpg",
          Span: "259",
        },
        {
          Id: 8,
          MusicName: "広橋真紀子 - いのちの名前 (生命之名)",
          SingerName: "Fall Out Boy",
          Path:
            "https://oss.krokro.top/music/%E5%BA%83%E6%A9%8B%E7%9C%9F%E7%B4%80%E5%AD%90%20-%20%E3%81%84%E3%81%AE%E3%81%A1%E3%81%AE%E5%90%8D%E5%89%8D%20%28%E7%94%9F%E5%91%BD%E4%B9%8B%E5%90%8D%29.mp3",
          ImagePath: "\\Sourse\\MusicCover\\20200320142052.png",
          Span: "349",
        },
      ],
    };
    this.indexChange = this.indexChange.bind(this);
    this.addToList = this.addToList.bind(this);
  }
  indexChange() {
    this.setState({
      homeIndex: false,
    });
  }
  removeRepeat(list) {
    var obj = {};
    list = list.reduce(function (item, next) {
      obj[next.Id] ? "" : (obj[next.Id] = true && item.push(next));
      return item;
    }, []);
    return list;
  }
  addToList(list, play = false) {
    $.ajax("/music/song/GetSongsList", {
      data: { list: list },
      dataType: "json",
      traditional: true,
      success: function (result) {
        let mlist = this.state.mlist;
        result.reverse().forEach((item) => {
          mlist.unshift(item);
        });
        var list = this.removeRepeat(mlist); //去重
        console.log(list);
        this.setState(
          {
            mlist: list,
          },
          () => {
            if (play) {
              this.handlePlay();
            }
          }
        );
      }.bind(this),
    });
  }
  handlePlay() {
    document.getElementById("audio").play();
  }
  render() {
    return (
      <BrowserRouter history={history}>
        <div className="ue-bar">
          <div className="ue-bar-warp">
            <div className="ue-bar-logo">
              <a href="#">
                <img />
              </a>
            </div>
            <div className="ue-bar-nav">
              <ul ref="nav">
                <li>
                  <NavLink activeClassName="active" to="/home">
                    <em>首页</em>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    to="/singer"
                    onClick={this.indexChange}
                  >
                    <em>歌手</em>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    to="/ranking"
                    onClick={this.indexChange}
                  >
                    <em>排行榜</em>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    to="/category"
                    onClick={this.indexChange}
                  >
                    <em>分类</em>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    to="/search"
                    onClick={this.indexChange}
                  >
                    <em>搜索</em>
                  </NavLink>
                </li>
              </ul>
            </div>
            <div id="navbar_signin">
              <ul>
                <li>
                  <AccountNav />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="renderBody">
          <Player mlist={this.removeRepeat(this.state.mlist)} />
          <Switch>
            <Route
              from="/playlist/:id"
              component={() => (
                <Playlist
                  addToList={this.addToList}
                  handlePlay={this.handlePlay}
                ></Playlist>
              )}
              exact
            ></Route>
            {router.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                component={route.component}
                exact={route.exact}
              />
            ))}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
