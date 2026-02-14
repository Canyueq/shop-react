import { Modal } from "antd";
import type { ShowComponent } from "app/types/global";

const SetmealShow = (params: ShowComponent) => {
  const { open, title, children } = params;
  return (
    <Modal open={open} title={title}>
      {children}
    </Modal>
  );
};
export default SetmealShow;
