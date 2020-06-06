import React, { Component, useState, useEffect } from "react";
import { Checkbox, message, Input, List, Avatar, Spin } from "antd";
import { Link } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import $ from "jquery";
import {
  Collapse,
  Button,
  Popover,
  Modal,
  Descriptions,
  Form,
  Table,
  Switch,
  Select,
  Upload,
  Divider,
  Radio,
  InputNumber,
} from "antd";

const Extend = () => {
  const [data, setData] = useState({ sings: [], songs: [] });
  const [visible, setVisible] = useState(false);
  const [singer, SetSinger] = useState("");
  const init = () => {
    $.getJSON("/User/Account/GetUploads", function (result) {
      setData(result);
    });
  };
  useEffect(init, data);

  const props = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    showUploadList: false,
    beforeUpload(file) {
      const isMp3 = file.type === "audio/mpeg";
      if (!isMp3) {
        message.error("只能上传mp3文件!");
        return false;
      }
      var jsmediatags = require("jsmediatags");
      jsmediatags.read(file, {
        onSuccess: ({ tags }) => {
          let singer = tags.artist;
          let title = tags.title;
          SetSinger(singer);
          var formData = new FormData();
          formData.append("singer", singer);
          formData.append("title", title);
          formData.append("file", file);
          $.ajax("/Music/Song/Upload", {
            dataType: "json",
            type: "POST",
            async: false,
            data: formData,
            processData: false, // 使数据不做处理
            contentType: false, // 不要设置Content-Type请求头
            beforeSend: function () {
              message.success("开始上传");
            },
            success: function (result) {
              if (result.singer == false) {
                message.error("暂无歌手信息");
                showModal();
              } else {
                message.success("上传成功");
                init();
              }
            },
          });
        },
      });
      return false;
    },
  };
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (e) => {
    setVisible(false);
  };
  const handleCancel = (e) => {
    setVisible(false);
  };
  const columns1 = [
    {
      title: "歌曲",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "歌手",
      dataIndex: "singer",
      key: "singer",
    },
    {
      title: "上传时间",
      dataIndex: "createTime",
      key: "createTime",
    },

    {
      title: "",
      render: (text, record) => (
        <Link style={{ color: "#1890FF" }} to={"/song/" + record.id}>
          详情
        </Link>
      ),
    },
  ];
  const columns2 = [
    {
      title: "",
      dataIndex: "cover",
      key: "cover",
      render: (text) => <Avatar src={text} size="small"></Avatar>,
    },
    {
      title: "歌手",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "",
      render: (text, record) => (
        <Link style={{ color: "#1890FF" }} to={"/singer/" + record.id}>
          详情
        </Link>
      ),
    },
  ];
  return (
    <div>
      <div>
        <Modal
          width="250px"
          title="创建歌手信息"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose={true}
          footer={null}
        >
          <SingerForm name={singer} setVisible={setVisible}></SingerForm>
        </Modal>
        <Upload {...props} accept="audio/mpeg">
          <Button type="primary" style={{ width: "260px" }}>
            <UploadOutlined /> 点击上传音乐
          </Button>
        </Upload>
      </div>
      <Divider orientation="left">已上传的歌曲</Divider>
      <Table columns={columns1} dataSource={data.songs} />
      <Divider orientation="left">创建的歌手</Divider>
      <Table columns={columns2} dataSource={data.singers} />
    </div>
  );
};

const SingerForm = ({ name, setVisible }) => {
  const [img, setImg] = useState("");
  const [imgFile, setFile] = useState(null);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      callback(reader.result);
    });
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    if (isJpgOrPng && isLt2M) {
      console.log(file);
      getBase64(file, (imageUrl) => {
        setImg(imageUrl);
      });
      setFile(file);
    }
    return false; //文件与表单一起提交时，设置为false
  };
  const onFinish = (values) => {
    var formData = new FormData();
    formData.append("name", name);
    formData.append("nationality", values.nationality);
    formData.append("gender", values.gender);
    formData.append("age", values.age);
    if (imgFile == null) {
      message.error("请选择图片");
      return false;
    }
    formData.append("file", imgFile);
    $.ajax("/Music/Singer/Create", {
      type: "post",

      //ajax2.0可以不用设置请求头，但是jq帮我们自动设置了，这样的话需要我们自己取消掉
      contentType: false,
      //取消帮我们格式化数据，是什么就是什么
      processData: false,

      data: formData,
      success: function () {
        setVisible(false);
        message.success("创建成功，请重新上传歌曲");
      },
    });
    //imgFile = null;
  };
  return (
    <Form name="Create" onFinish={onFinish} scrollToFirstError>
      <div>姓名：{name}</div>
      <img src={img} height="100px"></img>
      <Form.Item
        name="cover"
        label="图片"
        rules={[
          {
            required: true,
            message: "请选择图片",
          },
        ]}
      >
        <Upload
          accept="image/*"
          beforeUpload={beforeUpload}
          showUploadList={false}
          isImageUrl={true}
        >
          <Button type="link">选择图片</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="nationality"
        label="地区"
        rules={[
          {
            required: true,
            message: "请选择地区",
          },
        ]}
      >
        <Select
          style={{ width: 200 }}
          optionFilterProp="children"
          placeholder="Select a person"
        >
          <Select.Option value="内地">内地</Select.Option>
          <Select.Option value="港澳">港澳</Select.Option>
          <Select.Option value="台湾">台湾</Select.Option>
          <Select.Option value="日韩">日韩</Select.Option>
          <Select.Option value="欧美">欧美</Select.Option>
          <Select.Option value="其他">其他</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="gender"
        label="性别"
        rules={[{ required: true, message: "请选择性别!" }]}
      >
        <Radio.Group>
          <Radio.Button value="男">男</Radio.Button>
          <Radio.Button value="女">女</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="age"
        label="年龄"
        rules={[
          { required: true, message: "请输入年龄!" },
          {
            type: "integer",
            message: "格式错误！",
          },
        ]}
      >
        <InputNumber min={6} max={99} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "200px" }}>
          保存修改
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Extend;
