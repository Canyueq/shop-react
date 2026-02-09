import React, { useState } from "react";
import { Button, Form, Input, Space } from "antd";
import { useNavigate } from "react-router";
import { login } from "app/api/employee";
import type {
  EmployeeLoginRes,
  EmployeeLoginReq,
} from "app/types/api/employee";
import useUserStore from "../../store/userStore";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [type, setType] = useState(false);
  const { setToken } = useUserStore();
  const onFinish = async (values: any) => {
    if (!type) {
      const res: EmployeeLoginRes = (await login(values)) as any;
      console.log("res", res);
      if (res.code === 1) {
        //把token存入localstorage
        setToken(res.data.token);
        navigate("/");
      }
    } else {
      // const res = await signUp(values);
      // console.log("res", res);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({ username: "admin", password: "123456" });
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item wrapperCol={{ offset: 20 }}>
        <Button type="link" onClick={() => setType(!type)}>
          {type ? "注册" : "登录"}
        </Button>
      </Form.Item>
      <Form.Item name="username" label="账号" rules={[{ required: true }]}>
        <Input placeholder="请输入账号" />
      </Form.Item>
      <Form.Item name="password" label="密码" rules={[{ required: true }]}>
        <Input placeholder="请输入密码" />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default App;
