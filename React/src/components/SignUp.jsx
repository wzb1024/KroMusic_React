import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Radio, message } from "antd";
import $ from "jquery";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Signup = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    $.post(
      "/User/Account/Signup",
      {
        UserName: values.username,
        Password: values.password,
        NickName: values.nickname,
        Gender: values.gender,
        Age: values.age,
        Email: values.email,
      },
      function (result) {
        if (result.State) {
          message.success("注册成功");
          setTimeout(() => props.history.goBack(), 1000);
        } else {
          message.error(result.ErrorMsg);
        }
      }
    );
  };
  const CheckUserName = (userName) => {
    $.getJSON("/User/Account/CheckUserName", { UserName: userName }, function (
      result
    ) {
      $("#ckUN").html(result.Msg);
    });
  };
  const CheckNickName = (nickNme) => {
    $.getJSON("/User/Account/CheckNickName", { NickName: nickNme }, function (
      result
    ) {
      $("#ckNN").html(result.Msg);
    });
  };

  return (
    <div id="signup_container">
      <div id="signup_box">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: "请输入用户名！",
              },
              {
                max: 10,
                min: 3,
                message: "用户名长度为3~10",
              },
              {
                whitespace: true,
                message: "禁止为空格",
              },
            ]}
          >
            <Input onChange={() => CheckUserName(event.target.value)} />
          </Form.Item>
          <span id="ckUN"></span>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
              {
                max: 10,
                min: 6,
                message: "密码长度为6~16",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "请确认密码!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("两次输入的密码不一样!");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[
              {
                required: true,
                message: "请输入昵称",
              },
              {
                type: "string",
                message: "昵称为字符串",
              },
              {
                whitespace: true,
                message: "禁止为空格",
              },
              {
                max: 6,
                min: 3,
                message: "昵称长度为3~6",
              },
            ]}
          >
            <Input onChange={() => CheckNickName(event.target.value)} />
          </Form.Item>
          <span id="ckNN"></span>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "邮箱格式错误",
              },
              {
                required: true,
                message: "请输入邮箱",
              },
            ]}
          >
            <Input />
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

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Signup;
