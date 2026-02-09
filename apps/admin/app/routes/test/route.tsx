import { Button } from "antd";
import { useState } from "react";
import TestImoprt from "./import";
import type { VoidFunc } from "app/types/global";

export default function Test() {
  const [open, setOpen] = useState(false);
  const onCancel: VoidFunc = () => {
    setOpen(false);
  };
  const ok = () => {
    setOpen(false);
  };
  return (
    <>
      <div>试卷内容</div>
      <Button onClick={() => setOpen(true)}>导入试卷</Button>
      <TestImoprt open={open} onCancel={onCancel} onOk={ok} />
    </>
  );
}
