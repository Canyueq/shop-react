import { Modal, Select } from "antd";
import { Form } from "antd";
import type { TestImportType } from "app/types/routes/test";

export default function TestImoprt(param: TestImportType) {
  const { open, onCancel, onOk } = param;
  const [form] = Form.useForm();
  return (
    <Modal
      title={"导入试卷"}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      closeIcon={false}
    >
      <Form form={form}>
        <Form.Item>
          <Select>请选择要导入的文件</Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
