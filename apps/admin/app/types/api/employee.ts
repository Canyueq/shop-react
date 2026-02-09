import type {
  PaginationReq,
  BaseRes,
  BasePaginationRes,
  BasePaginationReq,
} from "../global";

//员工登录响应
interface EmployeeLogin {
  id: number;
  name: string;
  token: string;
  userName: string;
}
export type EmployeeLoginRes = BaseRes<EmployeeLogin>;
//员工登录请求
export interface EmployeeLoginReq {
  username: string;
  password: string;
}
//新增界面组件的参数
export interface AddEmployee {
  idNumber: string;
  name: string;
  phone: string;
  sex: string;
  username: string;
}
//编辑界面组件的参数
export interface EditEmployee extends AddEmployee {
  id: number;
}
//员工类型
export interface Employee {
  id?: number;
  idNumber: string;
  name: string;
  phone: string;
  sex: string;
  status: number;
  username: string;
  createTime: number[];
  createUser: number;
  updateUser: number;
  updateTime: number[];
}
//分页查询的参数和结果类型
export interface EmployeePagination {
  name: string | undefined;
}
export type EmployeePaginaitonReq = BasePaginationReq & EmployeePagination;
export interface EmployeeReq {
  id: number;
}
export type EmployeeResDate = BasePaginationRes<Employee>;
export type EmployeePaginaitonRes = BaseRes<EmployeeResDate>;
export type EmployeeRes = BaseRes<Employee>;
