import React, { Component } from "react";
import { Card, Checkbox, message } from "antd";
import { Link } from "react-router-dom";
import $ from "jquery";
const gridStyle = {
  width: "25%",
  padding: "5px",
  paddingBottom: "5px",
  height: "160px",
};
var deleteList = new Array();
export default class CollectedPlaylists extends Component {
  constructor() {
    super();
    this.state = {
      isEdit: false,
      playlists: [],
    };
    this.handleEditClick = this.handleEditClick.bind(this);
  }
  componentDidMount() {
    $.getJSON(
      "/Music/Playlist/GetFavoritePlaylists",
      function (result) {
        if (result.State) {
          this.setState({ playlists: result.Playlists });
        }
      }.bind(this)
    );
  }
  handleEditClick(e) {
    if (this.state.playlists.length == 0) return;
    if (this.state.isEdit) {
      $.ajax("/Music/Playlist/CancelCollectPlaylists", {
        type: "get",
        data: { playlists: deleteList },
        traditional: true,
        success: function (result) {
          if (result.State) {
            message.success("成功取消收藏！");
            deleteList = new Array();
            this.setState({ playlists: result.Playlists });
          } else {
            message.error(result.ErrorMsg);
          }
        }.bind(this),
      });
      this.setState({ isEdit: false });
      e.target.innerHTML = "编辑";
    } else {
      this.setState({ isEdit: true });
      e.target.innerHTML = "取消收藏";
    }
  }
  handleChange(e) {
    if (e.target.checked) {
      deleteList.push(parseInt(e.target.id));
    } else {
      deleteList.pop(parseInt(e.target.id));
    }
  }
  render() {
    return (
      <>
        {this.state.playlists.length > 0 ? (
          <div
            style={{
              width: "100%",
              padding: "10px 0px",
              borderBottom: "0.5px solid rgba(0,0,0,0.4)",
            }}
          >
            <b style={{ fontSize: "16px" }}>全部收藏歌单</b>
            <div className="edit_collected" style={{ float: "right" }}>
              <button onClick={this.handleEditClick}>编辑</button>
              <button
                id="playlist_cancelBtn"
                onClick={this.handleEditClick}
                style={{ display: "none" }}
              >
                取消收藏
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}

        {this.state.playlists.length > 0 ? (
          <Card>
            {this.state.playlists.map((Item) => (
              <Card.Grid key={Item.Id} style={gridStyle}>
                <Checkbox
                  onChange={this.handleChange}
                  id={Item.Id.toString()}
                  className="playlist_ckb"
                  style={
                    this.state.isEdit
                      ? { display: "block", position: "absolute", top: "2px" }
                      : { display: "none", position: "absolute", top: "2px" }
                  }
                ></Checkbox>
                <Link to={"/playlist/" + Item.Id}>
                  <img src={Item.Cover} height="80%" width="100%" />
                </Link>
                <div>
                  <Link
                    style={{ fontSize: "12px" }}
                    to={"/playlist/" + Item.Id}
                  >
                    {Item.Name}
                  </Link>
                </div>
              </Card.Grid>
            ))}
          </Card>
        ) : (
          <div
            style={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            啥也没有~
          </div>
        )}
      </>
    );
  }
}
