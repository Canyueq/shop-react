/**
 * 地址簿接口（完全对齐后端 AddressBook 实体）
 */
export interface Address {
  /** 地址ID（新增时无，编辑时有） */
  id?: number | string;
  /** 用户ID（后端字段：userId） */
  userId?: number | string;
  /** 收货人（后端字段：consignee，对应前端原name） */
  consignee: string;
  /** 手机号（后端字段：phone） */
  phone: string;
  /** 性别（后端字段：sex，0=女，1=男；前端映射为易读的枚举） */
  sex: "0" | "1" | "female" | "male";
  /** 省级区划编号（后端字段：provinceCode） */
  provinceCode?: string;
  /** 省级名称（后端字段：provinceName） */
  provinceName?: string;
  /** 市级区划编号（后端字段：cityCode） */
  cityCode?: string;
  /** 市级名称（后端字段：cityName） */
  cityName?: string;
  /** 区级区划编号（后端字段：districtCode） */
  districtCode?: string;
  /** 区级名称（后端字段：districtName） */
  districtName?: string;
  /** 详细地址（后端字段：detail） */
  detail: string;
  /** 标签（后端字段：label，对应前端原tag） */
  label: string | "home" | "company" | "other";
  /** 是否默认（后端字段：isDefault，0=否，1=是） */
  isDefault?: 0 | 1;
}

// 可选：封装性别映射工具（方便前端展示/提交）
export const sexMapping = {
  // 后端值 → 前端展示
  "0": "女",
  "1": "男",
  female: "女",
  male: "男",
  // 前端值 → 后端提交
  getSubmitValue: (gender: string) => {
    return gender === "female" || gender === "0" ? "0" : "1";
  },
};

// 可选：封装默认地址判断工具
export const isDefaultAddress = (address: Address) => {
  return address.isDefault === 1;
};
