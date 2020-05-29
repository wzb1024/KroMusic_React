import React, { Component } from "react";
import Carousel from "@/components/Carousel";
import $ from "jquery";

class HomeIndex extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
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
            <Carousel />
          </div>
        </div>
        <div id="hit-singers"></div>
        <div id="index-ranking"></div>
      </div>
    );
  }
}

export default HomeIndex;
