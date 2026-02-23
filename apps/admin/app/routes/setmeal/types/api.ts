import type {
  BasePaginationReq,
  BasePaginationRes,
  BaseRes,
} from "app/types/global";
import type { SetmealTableItem } from "./Setmeal";
export type SetmealPaginationRes = BaseRes<BasePaginationRes<SetmealAddReq>>;
export type SetmealPage = {
  name: string;
  status: number;
  categoryId: number;
};
export type SetmealPaginationReq = BasePaginationReq & SetmealPage;
export type SetmealAddReq = {
  id?: number;
  name: string;
  status: number;
  categoryId: number;
  price: string;
  description: string;
  image: string;
  setmealDishes: Array<any>;
};
