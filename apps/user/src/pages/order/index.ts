// 页面数据类型
export interface OrderPageData {
  title: string;
}

// 订单相关API类型
export interface OrderItem {
  id: number | string;
  orderNumber: string;
  status: number;
  totalAmount: number;
  orderTime: string;
  // 其他订单字段
}

export interface OrderListReq {
  page: number;
  pageSize: number;
  status?: number;
}

export interface OrderDetailReq {
  orderId: number | string;
}

export interface OrderCancelReq {
  orderId: number | string;
}

// API响应类型
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface OrderListRes {
  records: OrderItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OrderDetailRes extends OrderItem {
  // 订单详情字段扩展
  orderItems: OrderItemDetail[];
  address: any; // 地址信息
}

export interface OrderItemDetail {
  id: number | string;
  dishName: string;
  amount: number;
  number: number;
  // 其他订单菜品字段
}
