import React, { Component } from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";
const PlaylistCard = ({ msg }) => {
  return (
    <Card
      bodyStyle={{ padding: "2px 3px" }}
      size="small"
      hoverable
      className="playlist_card"
      cover={
        <Link to={'/playlist/'+msg.Id}>
          <img height={180} width={180} alt="example" src={msg.Cover} />
        </Link>
      }
    >
      <div>
        <Link to={'/playlist/'+msg.Id}> {msg.Name}</Link>
      </div>
      <div>
        <Link to={"/User/" + msg.OwnerId}>{msg.NikName}</Link>
      </div>
      <label>
        <span>播放量:</span>
        {msg.PlayTimes}
      </label>
    </Card>
  );
};
export default PlaylistCard;
