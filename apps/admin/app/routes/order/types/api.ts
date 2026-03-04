// 订单搜索请求类型
export interface OrdersPageQueryDTO {
  page: number;
  pageSize: number;
  number?: string;
  phone?: string;
  beginTime?: string;
  endTime?: string;
  status?: number;
}

// 订单分页数据类型
export interface OrderPaginationData {
  records: any[];
  total: number;
}

// 订单API响应类型
export interface OrderPaginationRes {
  code: number;
  data: OrderPaginationData;
  message: string;
}

// 订单数量统计响应类型
export interface OrderStatisticsVO {
  toBeConfirmed: number;
  confirmed: number;
  deliveryInProgress: number;
  completed: number;
  canceled: number;
}

// 订单详情响应类型
export interface OrderVO {
  id: number;
  number: string;
  name: string;
  phone: string;
  address: string;
  orderTime: number[];
  checkoutTime: number[];
  payStatus: number;
  payMethod: number;
  payAmount: number;
  status: number;
  remark: string;
  tablewareQuantity: number;
  dishes: any[];
  setmeals: any[];
}

// 订单确认请求类型
export interface OrdersConfirmDTO {
  id: number;
}

// 订单拒单请求类型
export interface OrdersRejectionDTO {
  id: number;
  rejectionReason: string;
}

// 订单取消请求类型
export interface OrdersCancelDTO {
  id: number;
  cancelReason: string;
}