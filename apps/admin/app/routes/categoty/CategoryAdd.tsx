import { Button, Form, Input, message, Space } from "antd";
import { addCategory } from "app/api/category";
type DishesAddProps = {
  onOk: () => void;
  onCancel: () => void;
  type: number | undefined;
};
export default function CategoryAdd(paramas: DishesAddProps) {
  const { onOk, onCancel, type } = paramas;
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    values.type = type;
    await addCategory(values).then(() => {
      message.success(
        `新增${values.type === 2 ? "菜品" : "套餐"}${values.name}成功`,
      );
    });
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
      <Form.Item name="button">
        <Space>
          <Button type="primary" htmlType="submit">
            确认
          </Button>
          <Button onClick={() => onCancel()}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
