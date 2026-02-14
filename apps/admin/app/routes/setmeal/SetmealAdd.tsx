import { Button, Form, Input, Select } from "antd";
import { add } from "app/api/setmeal";
import type { SetmealTableItem } from "./types/Setmeal";
import DishAdd from "./DishAdd";
import { useState } from "react";
type SetmalAddType = {
  close: () => void;
};
const SetmalAdd = ({ close }: SetmalAddType) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const onFinish = async (values: SetmealTableItem) => {
    await add(values);
  };
  const handleCancel = () => {
    close();
  };
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="name" label="套餐名称">
        <Input placeholder="请输入套餐名称" />
      </Form.Item>
      <Form.Item name="category" label="套餐分类">
        <Select placeholder="请选择套餐分类" />
      </Form.Item>
      <Form.Item name="price" label="套餐价格">
        <Input placeholder="请输入套餐价格" />
      </Form.Item>
      <Form.Item name="dish" label="套餐菜品">
        (open&&
        <DishAdd open={open} close={() => setOpen(false)} />)
      </Form.Item>
      <Form.Item name="image" label="套餐图片">
        <Input placeholder="请输入套餐名称" />
      </Form.Item>
      <Form.Item name="description">
        <Input placeholder="请输入套餐描述" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">保存</Button>
        <Button color="red" onClick={handleCancel}>
          取消
        </Button>
      </Form.Item>
    </Form>
  );
};
export default SetmalAdd;
