import { Form, Button, Input, Select, type FormProps, message } from "antd";
import { editEmployee } from "app/api/employee";
import { useEffect } from "react";
import type { BaseRes } from "app/types/global";
import type { AxiosResponse } from "axios";
import type { EmployeeAddType } from "app/types/routes/employee";
import type { EditEmployee } from "app/types/api/employee";

const EmployeeEdit = (param: EmployeeAddType) => {
  const { handleOk, handleCancel, records } = param;
  const [form] = Form.useForm();
  const onSave: FormProps<EditEmployee>["onFinish"] = async (
    values: EditEmployee,
  ) => {
    console.log("请求", values);
    const res: BaseRes<AxiosResponse> = await editEmployee(values);
    switch (res.code) {
      case 1: {
        message.success("修改成功");
        handleOk;
        break;
      }
      case 0: {
        message.error(res.msg);
        break;
      }
    }
  };
  const onFinish = (values: EditEmployee) => {
    onSave(values);
    handleCancel();
  };
  const onThen = () => {
    onSave(form.getFieldsValue());
    form.resetFields();
  };
  const onFill = () => {
    form.setFieldsValue({
      idNumber: 1,
      name: "覃福贵",
      phone: "18208167954",
      sex: "男",
      username: "canyueq",
    });
  };
  useEffect(() => {
    form.setFieldsValue(records);
  }, [records]);
  return (
    <>
      <Form
        form={form}
        name="add-form"
        onFinish={onFinish}
        size="small"
        style={{ width: "400px" }}
      >
        <Form.Item name="id" style={{ display: "none" }}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="username" label="账号" required>
          <Input placeholder="请输入账号" />
        </Form.Item>
        <Form.Item name="name" label="员工姓名" required>
          <Input placeholder="请输入员工姓名" />
        </Form.Item>
        <Form.Item name="phone" label="手机号" required>
          <Input placeholder="手机号" />
        </Form.Item>
        <Form.Item name="sex" label="性别" required>
          <Select
            options={[
              { value: "1", label: "男" },
              { value: "2", label: "女" },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item name="idNumber" label="身份证号">
          <Input placeholder="身份证" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button type="primary" onClick={onThen}>
            保存并继续添加员工
          </Button>
          <Button type="primary" onClick={onFill}>
            fill
          </Button>
          <Button type="primary" onClick={handleCancel}>
            关闭
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default EmployeeEdit;
