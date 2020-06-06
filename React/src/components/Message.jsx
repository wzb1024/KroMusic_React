import React, { Component, useState, useEffect } from "react";
import { Divider, Space } from "antd";
import {
  Checkbox,
  message,
  Input,
  List,
  Avatar,
  Spin,
  Popover,
  Badge,
} from "antd";
import { Link } from "react-router-dom";
import $ from "jquery";
import moment from "moment";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const Content = ({ comments, replies }) => {
  const listData1 = [];
  const listData2 = [];
  comments.forEach((it) =>
    listData1.push({
      id: it.Id,
      pid: it.Pid,
      content: it.Content,
      nickname: it.NickName,
      time: it.Time,
      img: it.Img,
      pname: it.PName,
    })
  );
  replies.forEach((it) =>
    listData2.push({
      id: it.Id,
      pid: it.Pid,
      content: it.Content,
      nickname: it.NickName,
      time: it.Time,
      img: it.Img,
    })
  );
  const visit = (id) => {
    $.get("/User/Account/Visit", { id: id });
  };
  return (
    <Tabs type="card">
      <TabPane tab="收到的评论" key="1">
        <List
          itemLayout="vertical"
          size="small"
          pagination={{
            pageSize: 3,
          }}
          dataSource={listData1}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Link to={"/playlist/" + item.pid} onClick={() => visit(item.id)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.img} />}
                  title={
                    <>
                      <span>{item.nickname}</span>
                      <small>&nbsp;评论了&nbsp;</small>
                      <span style={{ color: "gray", fontSize: "10px" }}>
                        {item.pname}
                      </span>
                    </>
                  }
                  description={moment(item.time).fromNow()}
                />
                <p>{item.content}</p>
              </Link>
            </List.Item>
          )}
        />
      </TabPane>
      <TabPane tab="收到的回复" key="2">
        <List
          itemLayout="vertical"
          size="small"
          pagination={{
            pageSize: 3,
          }}
          dataSource={listData2}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Link to={"/playlist/" + item.pid} onClick={() => visit(item.id)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.img} />}
                  title={
                    <>
                      <span>{item.nickname}</span>
                      <small>&nbsp;回复了你</small>
                    </>
                  }
                  description={moment(item.time).fromNow()}
                />
                <p>{item.content}</p>
              </Link>
            </List.Item>
          )}
        />
      </TabPane>
    </Tabs>
  );
};
const Message = () => {
  const [count, setCount] = useState(0);
  const [comments, setComment] = useState([]);
  const [replies, setreply] = useState([]);
  const update = () => {
    $.getJSON("/User/Account/GetComAdRpl", function (result) {
      setCount(result.comments.length + result.replies.length);
      setComment(result.comments);
      setreply(result.replies);
    });
  };
  useEffect(() => {
    setInterval(update, 1000);
  }, []);
  return (
    <Popover content={<Content comments={comments} replies={replies} />}>
      <div style={{ position: "absolute", left: "-60px", top: "10px" }}>
        <Badge count={count}>
          <i className="fa fa-bell-o fa-2x" aria-hidden="true"></i>
        </Badge>
      </div>
    </Popover>
  );
};
export default Message;
