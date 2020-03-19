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
  useLocation
} from "react-router-dom";
import AccountNav from "@/components/AccountNav";
import Playlist from "@/components/Playlist";
import router from "@/Router";
class App extends Component {
  constructor() {
    super();
    this.state = {
      homeIndex: true,
      signinState: false,
      modultState: false
    };
    this.showSigninBox = this.showSigninBox.bind(this);
    this.indexChange = this.indexChange.bind(this);
    this.login = this.login.bind(this);
  }
  indexChange() {
    this.setState({
      homeIndex: false
    });
  }
  login(result) {
    this.setState({
      signinState: result
    });
  }
  showSigninBox(result) {
    this.setState({
      modultState: result
    });
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
                  <NavLink
                    activeClassName="active"
                    className={[
                      "nav_link",
                      this.state.homeIndex ? "active" : null
                    ].join(" ")}
                    to="/home"
                  >
                    <em>首页</em>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    className="nav_link"
                    to="/singer"
                    onClick={this.indexChange}
                  >
                    <em>歌手</em>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    className="nav_link"
                    to="/ranking"
                    onClick={this.indexChange}
                  >
                    <em>排行榜</em>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    className="nav_link"
                    to="/category"
                    onClick={this.indexChange}
                  >
                    <em>分类</em>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    className="nav_link"
                    to="/search"
                    onClick={this.indexChange}
                  >
                    <em>搜索</em>
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="ue-bar-signin">
              <ul>
                <li>
                  <AccountNav
                    signin={this.login}
                    signinState={this.state.signinState}
                    show={this.showSigninBox}
                    modultState={this.state.modultState}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="renderBody">
          <Switch>
            <Route path="/playlist" component={Playlist}></Route>
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
