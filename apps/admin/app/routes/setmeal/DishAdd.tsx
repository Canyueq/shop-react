import { Form, Modal } from "antd";
type DishAddType = {
  open: boolean;
  close: () => void;
};
const DishAdd = ({ open, close }: DishAddType) => {
  const [form] = Form.useForm();
  return (
    <Modal open={open}>
      <Form form={form}></Form>
    </Modal>
  );
};
export default DishAdd;
