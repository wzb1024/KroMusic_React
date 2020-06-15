import React, { Component, useState } from "react";
import $ from "jquery";
import { DownloadOutlined } from "@ant-design/icons";
import { Popover, Button, message } from "antd";

const dl = (name, path) => {
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = path;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Download = ({ data }) => {
  return (
    <button
      onClick={() => {
        dl(data.MusicName, data.Path);
      }}
    >
      <DownloadOutlined />
    </button>
  );
};
export default Download;
