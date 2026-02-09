import {Form} from "antd";
const DishAdd = () => {
  const {form} = Form.useForm();
  const onFinish = () => {
    
  }
  return <Form
           form={form}
           onFinish={onFinish}
           >
    <Form.Item name="name" }>
    </Form.Item>
  </Form>;
};
export default DishAdd;
