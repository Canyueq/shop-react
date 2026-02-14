import type {
  BasePaginationReq,
  BasePaginationRes,
  BaseRes,
  PaginationReq,
} from "app/types/global";
import type { SetmealTableItem } from "./Setmeal";
export type SetmealPaginationRes = BaseRes<BasePaginationRes<SetmealTableItem>>;
type SetmealPage = {
  name: string;
  status: number;
  category: number;
};
export type SetmealPaginationReq = BasePaginationReq & SetmealPage;
