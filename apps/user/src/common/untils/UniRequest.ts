import { useUserStore } from "../store";

const userStore = useUserStore();

class UniRequest {
  // 简化类型：用 string 而非 String（TS 推荐）
  public baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  // GET 请求：核心修复 - 返回 Promise，只传递 success/fail 结果
  get(url: string, config?: any) {
    // 必须返回 Promise
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${this.baseUrl}${url}${config ? `/${config}` : ""}`,
        method: "GET",
        header: {
          authentication: userStore.token || "",
        },
        // success 时 resolve 结果（你要的成功数据）
        success: (res) => resolve(res),
        // fail 时 reject 错误（你要的失败信息）
        fail: (e) => reject(e),
      });
    });
  }

  // DELETE 请求：简化为返回 Promise
  delete(url: string, config?: any) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${this.baseUrl}${url}${config ? `/${config}` : ""}`,
        method: "DELETE",
        header: {
          authentication: userStore.token || "",
        },
        success: (res) => resolve(res),
        fail: (e) => reject(e),
      });
    });
  }

  // POST 请求：简化为返回 Promise
  post(url: string, data?: any, config?: any) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${this.baseUrl}${url}${config ? `/${config}` : ""}`,
        method: "POST",
        header: {
          "Content-Type": "application/json",
          authentication: userStore.token || "",
        },
        data: data || {},
        success: (res) => resolve(res),
        fail: (e) => reject(e),
      });
    });
  }

  // PUT 请求：简化为返回 Promise
  put(url: string, data?: any, config?: any) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${this.baseUrl}${url}${config ? `/${config}` : ""}`,
        method: "PUT",
        header: {
          "Content-Type": "application/json",
          authentication: userStore.token || "",
        },
        data: data || {},
        success: (res) => resolve(res),
        fail: (e) => reject(e),
      });
    });
  }
}

// 创建全局实例（直接用这个实例调用，不用每次new）
export const request = new UniRequest("你的基础接口地址");
// 也可以导出类，自定义实例
export { UniRequest };
