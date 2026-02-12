import { Form, Button, Input } from "antd";
import { update } from "app/api/dish";
type DishAddType = {
  onOK: () => void;
  onCancel: () => void;
};
const DishEdit = (params: DishAddType) => {
  const { onOK, onCancel } = params;
  const [form] = Form.useForm<DishReq>();
  const onFinish = async (values: DishReq) => {
    await update(values);
    onOK();
  };
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="id" hidden={true}>
        <Input disabled />
      </Form.Item>
      <Form.Item name="name" label="菜品名称" required>
        <Input placeholder="请输入菜品名称" />
      </Form.Item>
      <Form.Item name="category" label="菜品分类" required>
        <Input placeholder="请输入菜品分类" />
      </Form.Item>
      <Form.Item name="price" label="售价" required>
        <Input placeholder="请输入售价" suffix="元" />
      </Form.Item>
      <Form.Item name="img" label="口味做法配置">
        <Input placeholder="请输入菜品名称" />
      </Form.Item>
      <Form.Item name="img" label="图片" required>
        <Input placeholder="请输入菜品名称" />
      </Form.Item>
      <Form.Item name="desrpiton" label="菜品描述">
        <Input placeholder="请输入菜品描述,最长200字" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          确认
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </Form.Item>
    </Form>
  );
};
export default DishEdit;
