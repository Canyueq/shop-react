import type { Address } from "../../common/typs/address";

// 页面数据类型
export interface AddressListItem extends Address {
  // 可以在这里添加页面特定的扩展字段
}

// API请求类型
export interface SetDefaultAddressReq {
  id: number | string;
}

// API响应类型
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface AddressListRes {
  id: number | string;
  consignee: string;
  phone: string;
  sex: "0" | "1";
  provinceName?: string;
  cityName?: string;
  districtName?: string;
  detail: string;
  label: string;
  isDefault: 0 | 1;
}[]

export interface SetDefaultAddressRes {
  success: boolean;
}
