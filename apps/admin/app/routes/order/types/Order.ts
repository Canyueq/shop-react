// 订单表格项类型
export interface OrderTableItem {
  id: number;
  number: string;
  name: string;
  address: string;
  estimatedDeliveryTime: number[];
  remark: string;
  tablewareQuantity: number;
  status: number;
  phone: string;
  orderTime: number[];
}

// 订单API请求类型
export interface OrderPaginationReq {
  page: number;
  pageSize: number;
  number?: string;
  phone?: string;
  beginTime?: number[];
  endTime?: number[];
  status?: number;
}

// 订单API响应类型
export interface OrderPaginationRes {
  data: {
    records: OrderTableItem[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}

// 订单状态枚举
export enum OrderStatus {
  ALL = 0,
  WAITING_FOR_RECEIPT = 1,
  WAITING_FOR_DELIVERY = 2,
  DELIVERING = 3,
  COMPLETED = 4,
  CANCELLED = 5
}