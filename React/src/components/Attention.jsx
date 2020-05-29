import React, { Component } from "react";
import { Tabs, Avatar, Result, Button, Upload, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import $ from "jquery";

export default class Attention extends Component {
  constructor() {
    super();
    this.state = {
      attention: [],
    };
  }
  componentDidMount() {
    $.getJSON(
      "/User/Account/GetAttention",
      function (result) {
        this.setState({
          attention: result,
        });
      }.bind(this)
    );
  }
  render() {
    return (
      <div id="attention">
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            padding: "0 0 5px 0",
            borderBottom: "1px solid gray",
          }}
        >
          关注歌手
        </h2>
        {this.state.attention.map((item) => (
          <Link key={item.Id} to={"/singer/" + item.Id}>
            <div className="attention_item">
              <Avatar src={item.ImgPath} size={100}></Avatar>
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {item.Name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}
