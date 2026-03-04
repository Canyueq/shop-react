import { request } from "../untils/request";

export const addNumber = (data: any) => {
  return request.post("/shoppingcart/add", data);
};
export const getDishBySetmealId = (parma: number) => {
  return request.get("/setmeal/dish", parma);
};
export const getShoppingCart = () => {
  return request.get("/shoppingcart/list");
};
export const cleanNumber = () => {
  return request.delete("/shoppingcart/clean");
};
export const redNumber = (data: any) => {
  return request.put("/shoppingcart/red", data);
};
