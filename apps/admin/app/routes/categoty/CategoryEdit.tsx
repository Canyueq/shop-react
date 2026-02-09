import { Button, Form, Input } from "antd";
import { update } from "app/api/category";
import type { CategoryTableType } from "app/types/routes/category";
import { useEffect } from "react";
type PackageAddProps = {
  onOk: () => void;
  onCancel: () => void;
  type: number;
  data?: CategoryTableType;
};
export default function CateGoryEdit(paramas: PackageAddProps) {
  const { onOk, onCancel, data } = paramas;
  const [form] = Form.useForm();
  useEffect(() => {
    // console.log("data", data);
    form.setFieldsValue(data);
  }, []);
  const onFinish = async (values: any) => {
    values.type = 1;
    await update(values);
    onOk();
  };
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item label="分类类型" name="type" hidden>
        <Input disabled />
      </Form.Item>
      <Form.Item label="分类名称" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="排序" name="sort">
        <Input />
      </Form.Item>
      <Form.Item label="排序" name="sort">
        <Button type="primary" htmlType="submit">
          确认
        </Button>
        <Button onClick={() => onCancel()}>取消</Button>
      </Form.Item>
    </Form>
  );
}
