import type { VoidFunc } from "../global";

export interface TestImportType {
  open: boolean;
  onCancel: VoidFunc | undefined;
  onOk: VoidFunc;
}
