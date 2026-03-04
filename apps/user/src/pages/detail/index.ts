// 页面数据类型
export interface DetailPageData {
  title: string;
}

// API响应类型（如果页面需要API请求）
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
