import request from "app/utils/request";
import type { CategoryTableType } from "app/types/routes/category";
import type { CategoryPaginationReq } from "app/types/api/category";

//分页查询请求
export const getCategoryPagination = (params: CategoryPaginationReq) => {
  return request.get("/category/page", { params: params });
};
export const deleteCategory = (id: number) => {
  return request.delete(`/category?id=${id}`);
};
export const forbindCategory = (
  status: number | undefined,
  id: number | undefined,
) => {
  return request.post(`/category/status/${status}?id=${id}`);
};
export const addCategory = (data: CategoryTableType) => {
  return request.post("/category", data);
};
export const update = (data: CategoryTableType) => {
  return request.put("/category", {}, { params: data });
};
