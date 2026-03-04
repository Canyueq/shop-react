// 页面数据类型
export interface MinePageData {
  title: string;
}

// 用户信息相关API类型
export interface UserInfoReq {
  // 如果需要获取用户信息的请求参数，可以在这里定义
}

export interface UserInfoRes {
  id: number | string;
  nickName: string;
  avatar: string;
  phone: string;
  email?: string;
  // 其他用户信息字段
}

// API响应类型
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
