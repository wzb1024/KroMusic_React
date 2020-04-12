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
      mlist: [],
    };
    this.indexChange = this.indexChange.bind(this);
    this.addToList = this.addToList.bind(this);
  }
  indexChange() {
    this.setState({
      homeIndex: false,
    });
  }
  addToList(list) {
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
          <Player list={this.state.mlist.reverse()} />
          <Switch>
            <Route
              from="/playlist/:id"
              component={()=><Playlist addToList={this.addToList} handlePlay={this.handlePlay}></Playlist>}
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
