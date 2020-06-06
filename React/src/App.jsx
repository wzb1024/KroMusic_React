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
import Song from "@/components/Song";
import Singer from "@/components/Singer";
import $ from "jquery";
class App extends Component {
  constructor() {
    super();
    this.state = {
      homeIndex: true,
      updateList: [],
    };
    this.indexChange = this.indexChange.bind(this);
    this.addToList = this.addToList.bind(this);
    this.onRef = this.onRef.bind(this);
  }
  indexChange() {
    this.setState({
      homeIndex: false,
    });
  }

  addToList(list, play = false) {
    this.player.addToList(list, play);
  }
  //父组件调用子组件player方法
  onRef(ref) {
    this.player = ref;
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
                    to="/singers"
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
          <Player onRef={this.onRef} />
          <Switch>
            <Route
              from="/playlist/:id"
              component={() => <Playlist addToList={this.addToList}></Playlist>}
              exact
            ></Route>
            <Route
              from="/song/:id"
              component={() => <Song addToList={this.addToList}></Song>}
              exact
            ></Route>
            <Route
              from="/singer/:id"
              component={() => <Singer addToList={this.addToList}></Singer>}
              exact
            ></Route>

            <Route
              from="/account"
              component={() => <Account addToList={this.addToList}></Account>}
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
