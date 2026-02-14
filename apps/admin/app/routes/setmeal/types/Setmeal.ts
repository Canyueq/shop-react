export interface SetmealTableItem {
  id: number; // 套餐ID
  name: string; // 套餐名称
  image: string; // 图片地址
  categoryName: string; // 套餐分类
  price: number; // 套餐价格
  status: number; // 0-停售 1-启售
  updateTime: string; // 最后操作时间
  // 其他可能的字段...
}
