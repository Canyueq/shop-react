import request from "app/utils/request";

//文件上传
export const upload = (data: any) => {
  return request.post("/common/upload", data);
};
