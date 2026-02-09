import { Modal } from "antd";
import type { EmployeeShowType } from "app/types/routes/employee";
const EmployeeShow = (param: EmployeeShowType) => {
  const { title, open, onClose, children } = param;
  return (
    <Modal
      title={title}
      open={open}
      footer={null}
      closeIcon={false}
      onCancel={onClose}
      destroyOnHidden
    >
      {children}
    </Modal>
  );
};
export default EmployeeShow;
