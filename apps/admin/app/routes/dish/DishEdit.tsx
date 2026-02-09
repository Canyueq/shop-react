import {Form,Button,Input} from "antd";
type DishAddType = {
  onOK:() => void
  onCancel:() => void
}
const DishEdit = (params:DishAddType) => {
  const {onOk,onCancel} = params
  const {form} = Form.useForm();
  const onFinish = (values) => {
    await update(values)
    onOk()
  }
  return <Form
           form={form}
           onFinish={onFinish}
           closeIcon={false}
           footer={null}
           >
        <Form.Item name="id" hidden={true}>
      <Input disabled/>
    </Form.Item>
    <Form.Item name="name" label="菜品名称">
      <Input placeholder="请输入菜品名称"/>
    </Form.Item>
            <Form.Item name="img" label="图片">
      <Input placeholder="请输入菜品名称"/>
    </Form.Item>
        <Form.Item name="category" label="菜品分类">
      <Input placeholder="请输入菜品名称"/>
    </Form.Item>
        <Form.Item name="price" label="售价">
      <Input placeholder="请输入售价"/>
    </Form.Item>
            <Form.Item name="price" label="售价">
      <Button type="primary" htmlType="submit">确认</Button>
              <Button type="" onClick={onCancel}>取消</Button>
    </Form.Item>
  </Form>;
};
export default DishEdit;
