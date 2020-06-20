import React, { Component } from "react";
import { PCarousel, SCarousel } from "@/components/Carousel";
import HomeRanking from "@/components/HomeRanking";
import { Divider } from "antd";

import $ from "jquery";
class HomeIndex extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
      <>
        <div id="recommend">
          <div id="rcmd-container">
            <div
              style={{
                position: "absolute",
                left: " 200px",
                fontSize: "25px",
                lineHeight: "30px",
                height: "120px",
                width: "30px",
                top: "80px",
              }}
            >
              歌单推荐
            </div>
            <PCarousel />
          </div>
        </div>
        <div id="hit-singers">
          <div id="SCarousel">
            <h3
              style={{
                margin: "0 auto",
                fontSize: "20px",
                fontWeight: "bold",
                display: "block",
                letterSpacing: "5px",
                textAlign: "center",
                paddingTop: "15px",
                color: "rgba(0,0,0,0.6)",
              }}
            >
              热门歌手
            </h3>
            <Divider></Divider>
            <SCarousel></SCarousel>
          </div>
        </div>
        <div id="index-ranking">
          <HomeRanking></HomeRanking>
        </div>
      </>
    );
  }
}

export default HomeIndex;
