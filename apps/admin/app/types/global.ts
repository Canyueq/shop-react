import type { AxiosResponse } from "axios";

//基础响应类型
export interface BaseRes<T> extends AxiosResponse {
  code?: number;
  data: T;
  msg?: string;
}
// 基础分页请求类型;
export interface BasePaginationReq {
  page: number;
  pageSize: number;
}
//基础分页请求类型联合类型
// export type PaginationReq<T = Record<string, never>> = BasePaginationReq & T;
export interface PaginationReq<T> {
  page: number;
  pageSize: number;
  args: T;
}
//基础展示组件类型
export interface ShowComponent {
  title: string;
  open: boolean;
  onCancel?: () => void;
  children: React.ReactNode;
}
//基础分页响应类型
export interface BasePaginationRes<T> {
  total: number;
  records: T[];
}
//基础分页响应类型联合类型
export type PaginationRes<T> = BaseRes<BasePaginationRes<T>>;
//void函数
export type VoidFunc = () => void;
