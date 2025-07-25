import React, { useState } from "react";
import { register } from "../utils";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal } from "antd";

function Register() {
  const [displayModal, setDisplayModal] = useState(false);

  const handleCancel = () => {
    setDisplayModal(false);
  };

  const signupOnClick = () => {
    setDisplayModal(true);
  };

  const onFinish = (data) => {
    register(data)
      .then(() => {
        setDisplayModal(false);
        message.success("Successfully signed up");
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  return (
    <>
      <Button shape="round" type="primary" onClick={signupOnClick}>
        Register
      </Button>
      <Modal
        title="Register"
        visible={displayModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true} // the Form will be unmount
      >
        <Form
          name="normal_register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          preserve={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password" }]}
          >
            <Input prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: "Please input your Firstname" }]}
          >
            <Input placeholder="firstname" />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={[{ required: true, message: "Please input your Lastname" }]}
          >
            <Input placeholder="lastname" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Register;
