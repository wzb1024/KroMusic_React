import React, { Component, useState } from "react";
import $ from "jquery";
import { Popover, Button, message } from "antd";

const addToPlaylist = (mid, pid) => {
  $.post(
    "/Music/Song/AddToPlaylist",
    { mid: mid, pid: pid },
    function (result) {
      if (result.State) {
        message.success("添加成功");
      } else {
        message.error("歌单中已存在");
      }
    }
  );
};

const Content = ({ list, setVisible, id }) => {
  if (list.length > 0) {
    var dom = list.map((item) => (
      <div className="list_item" onClick={() => addToPlaylist(id, item.Id)}>
        <Button
          type="link"
          style={{
            color: "rgba(0,0,0,0.5)",
            padding: "0px",
            height: "16px",
            lineHeight: "16px",
          }}
        >
          {item.Name}
        </Button>
      </div>
    ));
    return dom;
  } else {
    return <div onClick={() => setVisible(false)}>登录后添加到歌单</div>;
  }
};

const Add = ({ id, addToList }) => {
  const [list, addList] = useState([]);
  const [visible, setVisible] = useState(false);
  const handleClick = () => {
    $.getJSON("/User/Account/GetSelfPlaylists", function (result) {
      if (result.State) addList(result.Model);
      else addList([]);
    });
  };

  return (
    <button onClick={handleClick}>
      <Popover
        visible={visible}
        onVisibleChange={(visible) => setVisible(visible)}
        trigger="click"
        content={
          <Content list={list} id={id} setVisible={setVisible}></Content>
        }
        title={
          <Button
            style={{ padding: "0px" }}
            type="link"
            onClick={() => {
              addToList([id], false);
              setVisible(false);
            }}
          >
            播放列表
          </Button>
        }
        placement="rightTop"
        arrowPointAtCenter
      >
        <i className="fa fa-plus-square-o" aria-hidden="true"></i>
      </Popover>
    </button>
  );
};
export default Add;
