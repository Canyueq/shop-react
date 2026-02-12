import type { BasePaginationReq, PaginationRes } from "../global";
export type DishPage = {
  name: string;
};
export type DishPageReq = BasePaginationReq & DishPage;
export type DishPageRes = PaginationRes<DishType>;
