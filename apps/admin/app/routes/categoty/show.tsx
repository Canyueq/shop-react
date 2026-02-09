import { Modal } from "antd";
import type { ShowComponent } from "app/types/global";

export default function CategoryShow(paramas: ShowComponent) {
  const { title, children, open } = paramas;
  return (
    <Modal title={title} open={open} closeIcon={null} footer={null}>
      {children}
    </Modal>
  );
}
