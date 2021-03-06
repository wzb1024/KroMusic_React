﻿import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import Signin from "@/Components/Signin";
import { Avatar, Popover, message } from "antd";
import { UserOutlined, PoweroffOutlined } from "@ant-design/icons";
import Message from "@/Components/Message";

export default class AccountNav extends Component {
  constructor() {
    super();
    this.state = {
      signinState: false,
      nikName: null,
      imgPath: null,
    };
    this.success = this.success.bind(this);
  }
  componentDidMount() {
    $.ajax({
      url: "/SignIn/SigninState",
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
      <>
        <Message></Message>
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
      </>
    ) : (
      <>
        <Signin login={this.success} />
      </>
    );
  }
}
