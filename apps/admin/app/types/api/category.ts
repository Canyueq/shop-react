import type { CategoryTableType } from "app/types/routes/category";
import type {
  BasePaginationReq,
  PaginationReq,
  PaginationRes,
} from "app/types/global";
//分页查询请求
export type CategoryPagination = {
  name: string;
  type: number;
};
export type CategoryPaginationReq = BasePaginationReq & CategoryPagination;
//分页查询的结果
export type CategoryPaginationRes = PaginationRes<CategoryTableType>;
