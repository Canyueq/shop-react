import { request } from "./request";

export const test = (param: any) => {
  return request.get("test", param);
};
