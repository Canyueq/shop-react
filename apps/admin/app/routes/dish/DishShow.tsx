import { Modal } from "antd";
import type { ShowComponent } from "app/types/global";
export function DishShow(params: ShowComponent) {
  const { open, title, children } = params;
  return (
    <Modal open={open} title={title} closeIcon={false} footer={null}>
      {children}
    </Modal>
  );
}
