import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import Signin from "@/Components/Signin";
import { Avatar, Popover, message } from "antd";
import { UserOutlined, PoweroffOutlined } from "@ant-design/icons";

export default class AccountNav extends Component {
  constructor() {
    super();
    this.state = {
      signinState: false,
      nikName: null,
      imgPath: null,
    };
    this.signup = this.signup.bind(this);
    this.success = this.success.bind(this);
  }
  componentDidMount() {
    $.ajax({
      url: "/User/Account/SigninState",
      type: "get",
      dataType: "json",
      success: function (result) {
        if (result.SigninState) {
          this.success(result.NikName, result.Hdimg);
        }
      }.bind(this),
    });
  }
  success(nikname, imgpath) {
    this.setState({
      signinState: true,
      nikName: nikname,
      imgPath: imgpath,
    });
  }
  signup() {
    $.ajax({
      url: "/User/Account/Signup",
      type: "get",
      dataType: "html",
      success: function (result) {
        $("#sign_box").html(result);
      },
    });
  }
  signout() {
    $.ajax({
      url: "/user/account/signout",
      type: "get",
      success: function (result) {
        message.success(result);
        window.location.reload();
      },
    });
  }
  render() {
    return this.state.signinState ? (
      <Popover
        content={
          <>
            <p>
              <Link to="/account" className="nav_signlist">
                <UserOutlined style={{ marginRight: "5px" }} />
                个人资料
              </Link>
            </p>
            <p>
              <a className="nav_signlist" onClick={this.signout}>
                <PoweroffOutlined style={{ marginRight: "5px" }} />
                退出登录
              </a>
            </p>
          </>
        }
      >
        <div id="nav_img">
          <Avatar
            style={{ cursor: "pointer" }}
            size="large"
            src={this.state.imgPath}
          />
        </div>
      </Popover>
    ) : (
      <>
        <Signin login={this.success} />
        <a id="signup_link" onClick={this.signup}>
          <em>注册</em>
        </a>
      </>
    );
  }
}
