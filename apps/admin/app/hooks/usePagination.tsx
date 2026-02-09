import type { BasePaginationReq, PaginationReq } from "app/types/global";
import { useCallback, useState } from "react";

export function usePagination<T = {}>(
  defaultPage = 1,
  defaultSize = 10,
  defaultArgs: T = {} as T,
) {
  //处理分页类型
  type PaginationState = BasePaginationReq & T;
  const defaultPagination: PaginationState = {
    page: defaultPage,
    pageSize: defaultSize,
    ...defaultArgs,
  };
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination);

  // 修复：函数式更新 + 空依赖 + 正确打印
  const changePage = useCallback((val: number) => {
    setPagination((prev) => {
      const newPagination = { ...prev, page: val };
      // console.log("changePage 新状态：", newPagination); // 正确打印新值
      return newPagination;
    });
  }, []);

  const changeSize = useCallback((val: number) => {
    setPagination((prev) => {
      const newPagination = { ...prev, pageSize: val };
      // console.log("changeSize 新状态：", newPagination);
      return newPagination;
    });
  }, []);

  const changeArgs = useCallback((val: T) => {
    // console.log("changeArgs 输入值：", val);
    setPagination((prev) => {
      const newPagination = { ...prev, ...val };
      // console.log("changeArgs 新状态：", newPagination);
      return newPagination;
    });
  }, []);

  return { pagination, changePage, changeSize, changeArgs };
}
