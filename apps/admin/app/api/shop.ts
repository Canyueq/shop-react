import request from "app/utils/request";

export const setStatus = (status: number) => {
  return request.put(`shop/${status}`);
};
export const getStatus = () => {
  return request.get("shop/status");
};
