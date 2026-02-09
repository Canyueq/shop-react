import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export default [
  // 登录页：无布局
  route("/login", "routes/login/route.tsx"), // ← 移除 .tsx

  // 主布局：包裹所有需要导航栏的页面
  layout("routes/layout.tsx", [
    // ← 移除 .tsx
    route("/", "routes/home.tsx"), // ← 首页
    route("/category", "routes/categoty/route.tsx"),
    route("/demo", "routes/demo/route.tsx"),
    route("/order", "routes/order/route.tsx"),
    route("/statistics", "routes/statistics/route.tsx"),

    // ========== 菜品管理 ==========
    route("/dish", "routes/dish/route.tsx"), // 列表页

    // ========== 员工管理 ==========
    route("/employee", "routes/employee/route.tsx"), // 列表页

    // ========== 套餐管理 ==========
    route("/setmeal", "routes/setmeal/route.tsx"), // 列表页

    //模拟试卷
    route("/test", "routes/test/route.tsx"),
  ]),
] satisfies RouteConfig;
