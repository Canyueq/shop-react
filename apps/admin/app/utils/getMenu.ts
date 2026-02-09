import * as React from "react";
import type { MenuProps } from "antd";
import type { ItemType } from "antd/es/menu/interface";

// 对齐你的路由结构类型（和你提供的路由JSON完全匹配）
interface RouteItem {
  file: string;
  path: string;
  children?: RouteItem[];
}

/**
 * 转换路由结构为 Antd Menu 所需的 items 格式
 * @param routes 你的路由数据源（对应提供的JSON结构）
 * @returns 符合 Antd MenuProps["items"] 类型的菜单数组
 */
export function toAntdFormItems(
  routes: RouteItem[] | undefined,
): MenuProps["items"] {
  // console.log("原始路由结构", routes);

  // ========== 核心修复：适配你的路由结构读取逻辑 ==========
  let menuRoutes: RouteItem[] = [];
  if (Array.isArray(routes) && routes.length > 0) {
    // 1. 取根布局（routes[0]）的children（所有业务路由）
    const rootLayout = routes[1];
    if (rootLayout?.children && Array.isArray(rootLayout.children)) {
      menuRoutes = rootLayout.children;
    }
  }

  // 空菜单兜底
  if (menuRoutes.length === 0) {
    // console.warn("没有可用的菜单数据");
    return [];
  }

  // ========== 菜单名称映射（根据你的业务需求配置） ==========
  const menuNameMap: Record<string, string> = {
    "/": "首页",
    "/category": "分类管理",
    "/demo": "演示页面",
    "/order": "订单管理",
    "/statistics": "数据统计",
    "/login": "登录",
    "/home": "主页",
    "/dish": "菜品管理",
    "/dish/index": "菜品列表",
    "/dish/add": "新增菜品",
    "/employee": "员工管理",
    "/employee/index": "员工列表",
    "/employee/add": "新增员工",
    "/setmeal": "套餐管理",
    "/setmeal/index": "套餐列表",
    "/setmeal/add": "新增套餐",
    "/test": "模拟试卷",
  };

  // ========== 过滤不需要显示在菜单的路由（可选，根据需求调整） ==========
  const ignoredPaths = ["/login", "/home", "/"]; // 隐藏登录/主页/首页
  const filteredRoutes = menuRoutes.filter(
    (route) => !ignoredPaths.includes(route.path),
  );

  // ========== 递归生成 Antd Menu Items ==========
  const traverse = (route: RouteItem, parentPath = ""): ItemType => {
    // 拼接完整路径（解决子路由相对路径问题）
    const fullPath = parentPath
      ? `${parentPath}/${route.path}`.replace(/\/\/+/g, "/") // 去重斜杠
      : route.path;

    // 菜单显示名称（优先取映射表，无则取路径最后一段）
    const menuLabel =
      menuNameMap[fullPath] || fullPath.split("/").pop() || fullPath;

    // 递归处理子路由
    const childrenItems = route.children
      ?.map((child) => traverse(child, fullPath))
      .filter(Boolean) as ItemType[];

    // 区分 SubMenu（有子路由）和 MenuItem（无子路由）
    return {
      key: fullPath, // 全局唯一key（必须）
      label: menuLabel, // 菜单显示文本
      ...(childrenItems?.length > 0 ? { children: childrenItems } : {}),
    } as const;
  };

  // 生成最终菜单数组
  const finalMenuItems = filteredRoutes.map((route) => traverse(route));
  // console.log("生成的菜单数据", finalMenuItems);

  return finalMenuItems;
}
