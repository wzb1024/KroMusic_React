import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Radio } from "antd";
import RadioGroup from "antd/lib/radio/group";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

const SignUp = () => {
  const [form] = Form.useForm();

  const onFinish = values => {
    console.log("Received values of form: ", values);
  };

  return (
    <div id="signup_container">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ["zhejiang", "hangzhou", "xihu"],
          prefix: "86"
        }}
        scrollToFirstError
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: "请输入用户名！"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: "请输入密码"
            }
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
              message: "请确认密码!"
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("两次输入的密码不一样!");
              }
            })
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
              message: "请输入昵称!",
              whitespace: true
            },
            {
              type: "string"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "邮箱格式错误！"
            },
            {
              required: true,
              message: "请输入邮箱"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <RadioGroup>
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
          </RadioGroup>
        </Form.Item>
        <Form.Item
          name="age"
          label="年龄"
          rules={[{ required: true, message: "请输入年龄!" }]}
        >
          <InputNumber min={1} max={99} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default SignUp;
