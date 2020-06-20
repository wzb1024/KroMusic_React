import React from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import $ from "jquery";
import { Link } from "react-router-dom";
export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      errorMsg: null,
    };
    this.onFinish = this.onFinish.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: "/SignIn/Signin",
      type: "get",
      success: function (result) {
        this.setState({
          info: {
            username: result.UserName,
            password: result.Password,
            remember: result.RememberMe,
          },
        });
      }.bind(this),
    });
  }

  onFinish(values) {
    $.ajax({
      url: "/SignIn/Signin",
      type: "post",
      data: {
        UserName: values.username,
        Password: values.password,
        RememberMe: values.remember,
      },
      success: function (result) {
        if (result.Status) {
          window.location.reload();
        } else {
          alert(result.ErrorMsg);
        }
      }.bind(this),
    });
  }
  render() {
    return (
      <>
        <a onClick={() => this.setState({ visible: true })}>登录</a>
        <Modal
          visible={this.state.visible}
          title="登录"
          onCancel={() => this.setState({ visible: false })}
          footer={null}
        >
          <Form
            name="normal_login"
            className="login-form"
            onFinish={this.onFinish}
            initialValues={{ ...this.state.info }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ width: "50%", marginRight: "10%" }}
              >
                登录
              </Button>
              <span>
                Or
                <Link
                  onClick={() => this.setState({ visible: false })}
                  to="/signup"
                  style={{ color: "#3498db" }}
                >
                  注册
                </Link>
              </span>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
