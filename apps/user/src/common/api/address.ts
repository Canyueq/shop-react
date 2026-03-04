import type { Address } from "../typs/address";
import { request } from "../untils/request";

export const list = () => {
  return request.get("/addressBook/list");
};
export const save = (data: any) => {
  return request.post("/addressBook", data);
};
export const getById = (id: number) => {
  return request.get(`/addressBook/${id}`);
};
export const update = (data: any) => {
  return request.put("/addressBook", data);
};
export const setDefault = (data: any) => {
  return request.post("/addressBoos/default", data);
};
export const deleteById = (id: number) => {
  return request.delete("/address", id);
};
export const getDefault = () => {
  return request.post("/addressBoos/default");
};
