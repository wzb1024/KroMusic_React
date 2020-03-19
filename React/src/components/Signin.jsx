import React from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import $ from "jquery";

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: null
    };
    this.onFinish = this.onFinish.bind(this);
  }

  componentDidMount() {
    $.ajax("User/Account/Signin", {
      type: "get",
      success: function(result) {
        this.setState({
          info: {
            username: result.UserName,
            password: result.Password,
            remember: result.RememberMe
          }
        });
      }.bind(this)
    });
  }
  
  onFinish(values) {
    $.ajax("User/Account/Signin", {
      type: "post",
      data: {
        UserName: values.username,
        Password: values.password,
        RememberMe: values.remember
      },
      success: function(result) {
          if (result.Status) {
              this.props.login(result.NikName, result.Hdimg);
          }
          else {
              alert(result.ErrorMsg)
          }
      }.bind(this)
    });
  }
  render() {
    return (
      <>
        <a onClick={() => this.props.show(true)}>登录</a>
        <Modal
          visible={this.props.modultState}
          title="登录"
          onCancel={() => this.props.show(false)}
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
                  message: "Please input your Username!"
                }
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
                  message: "Please input your Password!"
                }
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

              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              Or <a href="">register now!</a>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
