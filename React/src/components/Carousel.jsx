import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
class Carousel extends Component {
  constructor() {
    super();
    this.state = {
      reco: [],
    };
  }
  handleMove() {
    var windowWidth = $("#carousel_window").width();
    var num1 = $("#carousel_nav>li").length;
    var boxWidth = $("#carousel_box").width(windowWidth * num1 + "px");
    var index = 0;
    //初始化容器宽度
    $(".carousel_item").each(function () {
      var num2 = $(this).children("li").length;
      $(this).width(num2 * 210 + "px");
    });

    function change() {
      var lis = $("#carousel_nav>li");
      var distance = "-" + index * windowWidth + "px";
      $("#carousel_box").css({ left: distance });
      lis.removeClass("active");
      lis.eq(index).addClass("active");
      index++;
      if (index == num1) index = 0;
    }

    var timer = setInterval(change, 5000);

    //鼠标悬浮切换
    $("#carousel_nav>li").hover(function () {
      clearInterval(timer);
      index = $(this).index();
      change();
    });
    $("#carousel_nav>li").mouseover(function () {
      clearInterval(timer);
    });
    $("#carousel_nav>li").mouseleave(function () {
      timer = setInterval(change, 5000);
    });
    $("#carousel_box>li").mouseover(function () {
      clearInterval(timer);
    });
    $("#carousel_box>li").mouseleave(function () {
      timer = setInterval(change, 5000);
    });
    //鼠标滑动调整位置
    $("#carousel_box>li").mousemove(function (e) {
      clearInterval(timer);
      var initx = $("#carousel_window").offset().left;
      var windowWidth = $("#carousel_window").width();
      var it = $(this).children().eq(0);
      var tot = it.width() - windowWidth;
      var rate = (e.clientX - initx) / windowWidth;
      var scroll = "-" + tot * rate + "px";
      it.css("left", scroll);
    });
  }
  componentDidMount() {
    $.getJSON(
      "/Music/Playlist/GetReco",
      function (result) {
        this.setState(
          {
            reco: result,
          },
          () => this.handleMove()
        );
      }.bind(this)
    );
  }

  render() {
    return (
      <div id="carousel_container">
        <ul id="carousel_nav">
          <li className="active">全部歌单</li>
          {this.state.reco.map((item, i) => {
            if (i > 0) {
              return <li key={item.Title}>{item.Title}</li>;
            }
          })}
        </ul>
        <div id="carousel_window">
          <ul id="carousel_box">
            {this.state.reco.map((item) => (
              <li key={item.Title}>
                <ul className="carousel_item">
                  {item.List.map((it) => (
                    <li key={it.Id} title={it.Name}>
                      <Link to={"/playlist/" + it.Id}>
                        <img src={it.Cover} />
                        <div className="carousel_cover">
                          <h2>{it.Name}</h2>
                          <h3>{it.PlayTimes} 次播放</h3>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default Carousel;
