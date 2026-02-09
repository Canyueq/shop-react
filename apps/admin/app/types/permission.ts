// src/types/permission.ts
/**
 * 角色枚举：按业务定义（苍穹外卖可扩展 Admin/Employee 等）
 */
export enum RoleEnum {
  // 超级管理员
  ADMIN = "ADMIN",
  // 普通员工
  EMPLOYEE = "EMPLOYEE",
  // 访客（可选）
  GUEST = "GUEST",
}

/**
 * 用户信息类型：和后端返回的用户信息对齐
 */
export interface UserInfo {
  id: number;
  username: string;
  name: string;
  // 核心权限字段：关联角色枚举
  role: RoleEnum;
  // 其他业务字段（如手机号、创建时间）
  phone?: string;
  createTime?: string;
}
