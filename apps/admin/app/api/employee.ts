import request from "app/utils/request";
import type {
  EmployeeLoginReq,
  AddEmployee,
  EditEmployee,
  EmployeePaginaitonReq,
} from "app/types/api/employee";
export const login = (data: EmployeeLoginReq) => {
  return request.post("/employee/login", data);
};
export const logout = () => {
  return request.post("/employee/logout");
};
export const addEmployee = (data: AddEmployee) => {
  return request.post("/employee", data);
};
export const getEmployeeList = (param: EmployeePaginaitonReq) => {
  return request.get("/employee/page", { params: param });
};
export const setStatus = (
  data: number | undefined,
  status: number | undefined,
) => {
  return request.post(`/employee/status/${status}?id=${data}`, {});
};
export const getEmployee = (param: number | undefined) => {
  return request.get("/employee", { params: param });
};
export const editEmployee = (data: EditEmployee) => {
  return request.put("/employee", {}, { params: data });
};
