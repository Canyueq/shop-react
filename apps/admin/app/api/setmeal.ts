import type { SetmealPaginationReq } from "app/routes/setmeal/types/api";
import type { SetmealTableItem } from "app/routes/setmeal/types/Setmeal";
import request from "app/utils/request";

export const page = (data: SetmealPaginationReq) => {
  return request.get("setmeal", { params: data });
};
export const add = (data: SetmealTableItem) => {
  return request.post("setmeal", data);
};
export const update = (data: SetmealTableItem) => {
  return request.post("setmeal", data);
};
export const status = (status: number, id: number) => {
  return request.post(`setmeal/status/${status}`, {}, { params: id });
};
export const deleteByIds = (ids: string) => {
  return request.delete("setmeal", { params: ids });
};
export const getById = (id: number) => {
  return request.get("setmeal", { params: id });
};
