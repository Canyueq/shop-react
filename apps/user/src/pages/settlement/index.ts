// 页面数据类型
export interface SettlementPageData {
  title: string;
}

// 结算相关API类型
export interface CreateOrderReq {
  addressId: number | string;
  remark?: string;
  // 其他订单创建参数
}

export interface CreateOrderRes {
  orderId: number | string;
  orderNumber: string;
  totalAmount: number;
  // 其他订单创建响应字段
}

// API响应类型
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
