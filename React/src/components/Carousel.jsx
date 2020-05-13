import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
class Carousel extends Component {
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
    this.handleMove();
  }

  render() {
    return (
      <div id="carousel_container">
        <ul id="carousel_nav">
          <li className="active">标题一</li>
          <li>标题二</li>
          <li>标题三</li>
          <li>标题四</li>
        </ul>
        <div id="carousel_window">
          <ul id="carousel_box">
            <li>
              <ul className="carousel_item">
                <li>
                  <img src="/src/img/1.jpg" />
                </li>
                <li>
                  <img src="/src/img/1.jpg" />
                </li>
                <li>
                  <img src="/src/img/1.jpg" />
                </li>
                <li>
                  <img src="/src/img/1.jpg" />
                </li>
                <li>
                  <img src="/src/img/1.jpg" />
                </li>
                <li>
                  <img src="/src/img/1.jpg" />
                </li>
                <li>
                  <img src="/src/img/1.jpg" />
                </li>
                <li>
                  <img src="/src/img/1.jpg" />
                </li>
                <li>
                  <img src="/src/img/1.jpg" />
                </li>
              </ul>
            </li>
            <li>
              <ul className="carousel_item">
                <li>
                  <img src="/src/img/2.jpg" />
                </li>
                <li>
                  <img src="/src/img/2.jpg" />
                </li>
                <li>
                  <img src="/src/img/2.jpg" />
                </li>
                <li>
                  <img src="/src/img/2.jpg" />
                </li>
                <li>
                  <img src="/src/img/2.jpg" />
                </li>
                <li>
                  <img src="/src/img/2.jpg" />
                </li>
              </ul>
            </li>
            <li>
              <ul className="carousel_item">
                <li>
                  <img src="/src/img/3.jpg" />
                </li>
                <li>
                  <img src="/src/img/3.jpg" />
                </li>
                <li>
                  <img src="/src/img/3.jpg" />
                </li>
              </ul>
            </li>
            <li>
              <ul className="carousel_item">
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>{" "}
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
                <li>
                  <img src="/src/img/4.jpg" />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
export default Carousel;
