import React, { Component } from "react";
import { Tabs, Avatar, Result, Button, Upload, message } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  UnorderedListOutlined,
  ProfileOutlined,
  TeamOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import $ from "jquery";
import CollectedPlaylists from "@/components/CollectedPlaylists";
import MyPlaylists from "@/components/MyPlaylists";
import FavoriteSongs from "@/components/FavoriteSongs";
import Attention from "@/components/Attention";
import Extend from "@/components/Extend";

const { TabPane } = Tabs;
export default class Account extends Component {
  constructor() {
    super();
    this.state = {
      isModify: false,
      error404: false,
      Hdimage: "",
      NickName: "",
      Gender: " ",
      Age: 0,
      Email: "",
    };
    this.handleHdimgChange = this.handleHdimgChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (this.state.isModify) {
      $.post(
        "/User/Account/ModifyMsg",
        {
          NickName: this.state.NickName,
          Gender: this.state.Gender,
          Email: this.state.Email,
          Age: this.state.Age,
        },
        function (result) {
          if (result.State) {
            this.setState({ isModify: false });
            $(".account_input").each(function () {
              $(this).attr("readOnly", true);
              $(this).css("backgroundColor", "white");
            });
            message.success("修改成功！");
          } else {
            message.error(result.ErrorMsg);
          }
        }.bind(this)
      );
    } else {
      this.setState({ isModify: true });
      $(".account_input").each(function () {
        $(this).attr("readOnly", false);
        $(this).css("backgroundColor", "#d9f7be");
        $(this.focus());
      });
    }
  }
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      callback(reader.result);
      document.querySelector("#nav_img img").src = reader.result;
    });
    reader.readAsDataURL(img);
  }
  handleHdimgChange(info) {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          Hdimage: imageUrl,
        })
      );
    }
  }
  beforeUpload(file) {
    const isLt4M = file.size / 1024 / 1024 < 4;
    if (!isLt4M) {
      message.error("请选择小于4M的图片");
    }
    return isLt4M;
  }
  componentDidMount() {
    $.getJSON(
      "/User/Account/GetAccountInfo",
      function (result) {
        if (result.State) {
          this.setState({
            NickName: result.AccountInfo.NickName,
            Email: result.AccountInfo.Email,
            Age: result.AccountInfo.Age,
            Gender: result.AccountInfo.Gender,
            Hdimage: result.AccountInfo.Hdimage,
          });
        } else {
          this.setState({
            error404: true,
          });
        }
      }.bind(this)
    );
  }
  render() {
    const state = this.state;
    return this.state.error404 ? (
      <Result
        status="404"
        title="404"
        subTitle="抱歉，该页面不存在。"
        extra={
          <Button
            type="primary"
            onClick={() => this.props.history.push("/home")}
          >
            回到首页
          </Button>
        }
      />
    ) : (
      <div id="account_container" className="container">
        <div id="account_msg">
          <img src="/Sourse/bkg-imgs/infor_side.jpg" />
        </div>
        <div id="account_taps">
          <Tabs
            type="line"
            tabPosition="left"
            defaultActiveKey="1"
            tabBarGutter={30}
          >
            <TabPane
              tab={
                <span>
                  <UserOutlined style={{ margin: "0px" }} /> 个人资料
                </span>
              }
              key="1"
            >
              <div id="msg_hdimg">
                <Avatar
                  src={state.Hdimage}
                  size={100}
                  icon={<UserOutlined />}
                />
                <Upload
                  accept="image/*"
                  beforeUpload={this.beforeUpload}
                  showUploadList={false}
                  onChange={this.handleHdimgChange}
                  action="/User/Account/ChangeHdimage"
                >
                  <Button type="link">更换头像</Button>
                </Upload>
              </div>
              <ul className="account_info">
                <li>
                  <b>昵称：</b>
                  <input
                    className="account_input"
                    type="text"
                    value={state.NickName}
                    readOnly={true}
                    onChange={(e) =>
                      this.setState({ NickName: e.target.value })
                    }
                  />
                </li>
                <li>
                  <b>性别：</b>
                  <span style={{ fontSize: "15px", marginLeft: "3px" }}>
                    {state.Gender}
                  </span>
                </li>
                <li>
                  <b>年龄：</b>
                  <input
                    className="account_input"
                    type="text"
                    value={state.Age}
                    readOnly={true}
                    onChange={(e) => this.setState({ Age: e.target.value })}
                  />
                </li>
                <li>
                  <b>邮箱：</b>
                  <input
                    className="account_input"
                    type="text"
                    value={state.Email}
                    onChange={(e) => this.setState({ Email: e.target.value })}
                    readOnly={true}
                  />
                </li>
              </ul>
              <div style={{ marginTop: "88px", marginLeft: "20px" }}>
                <Button type="primary" onClick={this.handleClick}>
                  {this.state.isModify ? "保存修改" : "修改信息"}
                </Button>
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <HeartOutlined style={{ margin: "0px" }} /> 我喜欢
                </span>
              }
              key="2"
            >
              <FavoriteSongs addToList={this.props.addToList}></FavoriteSongs>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <UnorderedListOutlined style={{ margin: "0px" }} /> 我的歌单
                </span>
              }
              key="3"
            >
              <MyPlaylists></MyPlaylists>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ProfileOutlined style={{ margin: "0px" }} /> 收藏歌单
                </span>
              }
              key="4"
            >
              <CollectedPlaylists></CollectedPlaylists>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <TeamOutlined style={{ margin: "0px" }} /> 关注歌手
                </span>
              }
              key="5"
            >
              <Attention></Attention>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileAddOutlined style={{ margin: "0px" }} /> 扩展乐库
                </span>
              }
              key="6"
            >
              <Extend></Extend>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
