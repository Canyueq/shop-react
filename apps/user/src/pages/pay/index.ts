// 页面数据类型
export interface PayPageData {
  title: string;
}

// 支付相关API类型
export interface PayReq {
  orderId: number | string;
  payMethod: number;
  // 其他支付参数
}

export interface PayRes {
  tradeNo: string;
  payUrl?: string;
  // 其他支付响应字段
}

export interface PayStatusReq {
  orderId: number | string;
}

export interface PayStatusRes {
  status: number;
  tradeNo: string;
  // 其他支付状态字段
}

// API响应类型
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
