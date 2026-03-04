// 页面数据类型
export interface DishListItem {
  id?: number;
  name: string;
  image: string;
  description: string;
  dishNumber: number;
  price: number;
  flavors?: Array<any>;
  type?: number;
}

export interface DishType {
  id?: number;
  name: string;
  image: string;
  description: string;
  dishNumber: number;
  price: number;
  flavors?: Array<any>;
}

export interface SetmealType {
  id?: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

export interface CategoryType {
  id?: number;
  name: string;
  type: number;
}

// API请求类型
export interface AddShoppingCartReq {
  dishId?: number;
  setmealId?: number;
  flavor?: string;
}

export interface RedShoppingCartReq {
  dishId?: number;
  setmealId?: number;
  flavor?: string;
}

// API响应类型
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface ShopStatusRes {
  status: number;
}

export interface LoginRes {
  token: string;
}

export interface CategoryListRes {
  id: number;
  name: string;
  type: number;
}[]

export interface DishListRes {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  flavors?: Array<any>;
}[]

export interface SetmealListRes {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}[]

export interface ShoppingCartListRes {
  id: number;
  name: string;
  amount: number;
  number: number;
}[]
