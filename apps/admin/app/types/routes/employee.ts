import type { ShowComponent } from "../global";
import type { Employee } from "../api/employee";

export interface EmployeeShowType extends ShowComponent {
  title: string;
  open: boolean;
  onClose: () => void;
}
export type EmployeeAddType = {
  handleOk: () => void;
  handleCancel: () => void;
  records?: Employee;
};
