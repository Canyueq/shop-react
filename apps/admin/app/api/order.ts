import type {
  OrdersPageQueryDTO,
  OrderPaginationData,
  OrderPaginationRes,
  OrderStatisticsVO,
  OrderVO,
  OrdersConfirmDTO,
  OrdersRejectionDTO,
  OrdersCancelDTO,
} from "app/routes/order/types/api";
import type { OrderTableItem } from "app/routes/order/types/Order";
import type { BasePaginationRes, BaseRes } from "app/types/global";
import request from "app/utils/request";

/**
 * 订单搜索
 * @param params 搜索参数
 * @returns 订单分页数据
 */
export const conditionSearch = (params: OrdersPageQueryDTO) => {
  return request.get("/order/conditionSearch", { params });
};

/**
 * 订单数量统计
 * @returns 各状态订单数量统计
 */
export const statistics = () => {
  return request.get<BaseRes<OrderStatisticsVO>>("/order/statistics");
};

/**
 * 查询订单详情
 * @param id 订单ID
 * @returns 订单详情
 */
export const details = (id: number) => {
  return request.get<BaseRes<OrderVO>>(`/order/details/${id}`);
};

/**
 * 接单
 * @param data 接单请求参数
 * @returns 操作结果
 */
export const confirm = (data: OrdersConfirmDTO) => {
  return request.put("/order/confirm", data);
};

/**
 * 拒单
 * @param data 拒单请求参数
 * @returns 操作结果
 */
export const rejection = (data: OrdersRejectionDTO) => {
  return request.put("/order/rejection", data);
};

/**
 * 取消订单
 * @param data 取消订单请求参数
 * @returns 操作结果
 */
export const cancel = (data: OrdersCancelDTO) => {
  return request.put("/order/cancel", data);
};

/**
 * 派送订单
 * @param id 订单ID
 * @returns 操作结果
 */
export const delivery = (id: number) => {
  return request.put(`/order/delivery/${id}`);
};

/**
 * 完成订单
 * @param id 订单ID
 * @returns 操作结果
 */
export const complete = (id: number) => {
  return request.put(`/order/complete/${id}`);
};