/**
 * 把 [年,月,日,时,分,秒,毫秒] 数组转换成 YYYY-MM-DD 格式
 * @param dateArr 日期数组，格式：[年, 月, 日, 时, 分, 秒, 毫秒]
 * @returns 格式化后的日期字符串（YYYY-MM-DD）
 */
const formatDateArray = (dateArr: number[]): string => {
  // 校验数组有效性（至少包含年、月、日）
  if (!dateArr || dateArr.length < 3) return "";

  // 提取年、月、日
  const [year, month, day] = dateArr;

  // 补0：月份/日期不足2位时前面加0（比如2月→02，5日→05）
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  // 拼接成 YYYY-MM-DD
  return `${year}-${formattedMonth}-${formattedDay}`;
};
export { formatDateArray };
