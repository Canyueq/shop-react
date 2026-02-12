import { message } from "antd";
import useUserStore from "app/store/userStore";
import type { BaseRes } from "app/types/global";
import axios, { type AxiosResponse } from "axios";
const token = useUserStore.getState().token;
const request = axios.create({
  baseURL: "/api",
  timeout: 60000,
  withCredentials: true,
});
request.interceptors.request.use(
  (config) => {
    config.headers.token = token;
    console.log("config", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
request.interceptors.response.use(
  (response): BaseRes<AxiosResponse> => {
    // console.log("响应", response.data);
    return response.data;
  },
  (error) => {
    console.log("error", error);
    if (error.response.status === 401) {
      localStorage.removeItem("adminToken");
      // 2. 提示 + 延迟跳转（确保提示能看到）
      message.error("登录已过期，请重新登录", 2);
      setTimeout(() => {
        // 确认登录页路径和你的路由一致！
        window.location.href = "/login";
        // 若用 React Router basename：window.location.href = '/你的basename/login';
      }, 1500);
    } else {
      message.error(error.response?.data?.msg || "请求失败");
    }
    return Promise.reject(error);
  },
);
export default request;
