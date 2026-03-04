import type { Address } from "../../common/typs/address";

// 页面组件属性类型
export interface AddressBookProps {
  addressData?: Address;
}

// API请求类型
export interface SaveAddressReq extends Omit<Address, "id" | "userId"> {
  // 新增地址时不需要id和userId，由后端生成或从token中获取
}

export interface UpdateAddressReq extends Address {
  // 更新地址时需要完整的Address信息，包括id
}

export interface DeleteAddressReq {
  id: number | string;
}

// API响应类型
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface SaveAddressRes {
  id: number | string;
  success: boolean;
}

export interface UpdateAddressRes {
  success: boolean;
}

export interface DeleteAddressRes {
  success: boolean;
}
