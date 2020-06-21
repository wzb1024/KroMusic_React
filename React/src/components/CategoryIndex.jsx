import React, { Component } from "react";
import $ from "jquery";
import { Button } from "antd";
import PlaylistCard from "@/components/PlaylistCard";
import { Pagination, Spin } from "antd";
import { Radio, Divider } from "antd";
import { FireOutlined, UnorderedListOutlined } from "@ant-design/icons";

class CatrgoryIndex extends Component {
  constructor(props) {
    super();
    this.state = {
      categories: [],
      pageIndex: 1,
      playlists: [],
      currentTypeId: 0,
      popsort: true,
      loading: false,
      total: 15,
    };

    this.select = this.select.bind(this);
    this.getAllPlaylists = this.getAllPlaylists.bind(this);
    this.initPage = this.initPage.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }
  initPage() {
    $.getJSON(
      "/Music/Playlist/GetPlaylists",
      {
        id: this.state.currentTypeId,
        pageIndex: 1,
        orderByHeat: this.state.popsort,
      },
      function (data) {
        this.setState({
          pageIndex: 1,
          total: data.Total,
          playlists: data.Playlists,
        });
      }.bind(this)
    );
  }

  componentDidMount() {
    $.ajax({
      url: "/Music/Playlist/GetCategories",
      type: "get",
      dataType: "json",
      success: function (data) {
        this.setState(
          {
            categories: data,
            loading: false,
          },
          () => this.initPage()
        );
      }.bind(this),
    });

    //控制页码宽度
    // var pagination = document.getElementsByClassName("pagination")[0];
    // var i = pagination.children.length;
    // pagination.style.width = i * 32 + (i - 1) * 8 + "px";
  }
  getAllPlaylists() {
    if (breadcrumb.children.length > 2) {
      breadcrumb.removeChild(breadcrumb.children[1]);
      breadcrumb.removeChild(breadcrumb.children[1]);
    }
    var btns = document.getElementsByClassName("category_btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].firstChild.className = "";
    }
    this.setState(
      {
        currentTypeId: 0,
      },
      () => this.initPage()
    );
  }
  select(id) {
    var u = event.target;

    var breadcrumb = document.getElementById("breadcrumb");
    if (breadcrumb.children.length > 1) {
      breadcrumb.removeChild(breadcrumb.children[1]);
      breadcrumb.removeChild(breadcrumb.children[1]);
    }
    var l = document.createElement("span");
    var t = document.createTextNode("/ ");
    l.appendChild(t);
    breadcrumb.appendChild(l);
    breadcrumb.appendChild(u.cloneNode(true));

    this.setState(
      {
        currentTypeId: id,
      },
      () => this.initPage()
    );
  }
  handlePageChange(page, pageSize) {
    $.getJSON(
      "/Music/Playlist/GetPlaylists",
      {
        id: this.state.currentTypeId,
        pageIndex: page,
        orderByHeat: this.state.popsort,
      },
      function (data) {
        this.setState({
          pageIndex: page,
          playlists: data.Playlists,
          total: data.Total,
        });
      }.bind(this)
    );
  }
  handleSortChange(e) {
    let key = e.target.value;
    if (key == "pop") {
      this.setState({ popsort: true }, this.initPage);
    } else {
      this.setState({ popsort: false }, this.initPage);
    }
  }
  render() {
    return (
      <div className="container">
        <div id="categories_nav">
          {this.state.categories.map((item, i) => (
            <div className="typeItem" key={i}>
              <span>{item.TypeName}:</span>
              {item.Categories.map((n) => (
                <Button
                  className="category_btn"
                  key={n.Id}
                  type="link"
                  onClick={() => this.select(n.Id)}
                >
                  <span>{n.Name}</span>
                </Button>
              ))}
            </div>
          ))}
        </div>
        <div id="playlists_cantainer">
          <div id="categorybar">
            <div id="breadcrumb">
              <Button type="link" onClick={this.getAllPlaylists}>
                全部歌单
              </Button>
            </div>
            <div id="sort_btn">
              <Radio.Group
                defaultValue="pop"
                buttonStyle="solid"
                onChange={this.handleSortChange}
              >
                <Radio.Button value="pop">
                  <FireOutlined style={{ margin: "0px" }} /> 最热
                </Radio.Button>
                <Radio.Button value="new">
                  <UnorderedListOutlined style={{ margin: "0px" }} /> 最新
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <Divider style={{ margin: "0px 0px 10px" }}></Divider>
          <div id="playlistcards">
            {this.state.loading ? (
              <Spin size="large" />
            ) : (
              this.state.playlists.map((item) => (
                <PlaylistCard key={item.Id} msg={item}></PlaylistCard>
              ))
            )}
          </div>
          <Pagination
            hideOnSinglePage={false}
            className="pagination"
            defaultPageSize={15}
            defaultCurrent={1}
            total={this.state.total}
            current={this.state.pageIndex}
            onChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default CatrgoryIndex;
