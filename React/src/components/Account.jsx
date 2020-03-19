import React, { Component } from "react";
import { Tabs, Avatar, Result, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import $ from "jquery";
import ReactDOM from "react-dom";
const { TabPane } = Tabs;
export default class Account extends Component {
  constructor() {
    super();
    this.state = {
      error404: false,
      userinfo: {},
      playlists: {},
      music: [],
      singers: []
    };
  }
  componentDidMount() {
  }
  render() {
    return this.state.error404 ? (
      <Result
        status="404"
        title="404"
        subTitle="抱歉，该页面不存在。"
        extra={<Button type="primary" onClick={()=>this.props.history.push('/home')}>回到首页</Button>}
      />
    ) : (
      <div id="account_container">
        <div id="account_msg">
          <div id="head_img">
            <Avatar size={100} icon={<UserOutlined />} />
          </div>
          <ul>
            <li>
              <label>昵称:</label>
            </li>
          </ul>
        </div>
        <div id="account_taps">
          <Tabs type="line" tabPosition="left">
            <TabPane tab="个人资料" key="1">
              <div></div>
            </TabPane>
            <TabPane tab="我喜欢" key="2"></TabPane>
            <TabPane tab="自建歌单" key="3"></TabPane>
            <TabPane tab="收藏歌单" key="4"></TabPane>
            <TabPane tab="关注歌手" key="5"></TabPane>
            <TabPane tab="通知" key="6"></TabPane>
            <TabPane tab="设置" key="7"></TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
