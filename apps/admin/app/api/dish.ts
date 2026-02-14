import request from "app/utils/request";
import type { DishPageReq } from "app/types/api/dish";

export const page = (data: DishPageReq) => {
  return request.get("/dish/page", { params: data });
};
export const deleteById = (ids: string) => {
  return request.delete(`/dish?ids=${ids}`);
};
export const add = (data: DishReq) => {
  return request.post("/dish", data);
};
export const update = (data: DishReq) => {
  return request.put("/dish", data);
};
export const setStatus = (status: number, id: number) => {
  return request.post(`/dish/status/${status}`, {}, { params: { id } });
};
export const getById = (id: number) => {
  return request.get(`/dish/${id}`);
};
export const getByCategoryId = (categoryId: number) => {
  return request.get("/admin/dish/list", { params: categoryId });
};
