import { Button, Space, Row, Col, Card } from "antd";
import { useState, useEffect, useRef } from "react";
import type { StatisticsResponse } from "./types/api";
import { TIME_RANGE_MAP } from "./CharConfiguration";
import { formatDate } from "../../utils/getFormatTime";
import type { StatisticsParams } from "./types/api";
import { turnoveChatOption, userChartOption, orderChartOption, topChartOption } from "./CharConfiguration";
import * as echarts from 'echarts';
import { turnoverStatistics, userStatistics, orderStatistics, topStatistics, exportStatisticsData } from "./api";
// 类型守卫：收窄 xAxis 类型（解决 CategoryAxisOption 访问 data 问题）
const isSingleCategoryXAxis = (
  xAxis: echarts.XAXisComponentOption | echarts.XAXisComponentOption[] | undefined
): xAxis is echarts.XAXisComponentOption & { data?: string[] } => {
  return !!xAxis && !Array.isArray(xAxis) && xAxis.type === 'category';
};

// 类型守卫：收窄 series 为数组类型（解决数字索引问题）
const isSeriesArray = (
  series: echarts.SeriesOption | echarts.SeriesOption[] | undefined
): series is echarts.SeriesOption[] => {
  return !!series && Array.isArray(series);
};
const Statistics = () => {
  const businessRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<StatisticsParams>({ begin: formatDate(Date.now() - 1000 * 60 * 60 * 24), end: formatDate(Date.now()) });
  const turnoveChatRef = useRef<echarts.ECharts | null>(null);
  const userChartRef = useRef<echarts.ECharts | null>(null);
  const orderChartRef = useRef<echarts.ECharts | null>(null);
  const topChartRef = useRef<echarts.ECharts | null>(null);
  const initCharts = () => {
    turnoveChatRef.current = echarts.init(businessRef.current);
    userChartRef.current = echarts.init(userRef.current);
    orderChartRef.current = echarts.init(orderRef.current);
    topChartRef.current = echarts.init(topRef.current);
  }
  // 核心切换函数
  const switchTime = (num: number = 1) => {
    // 校验参数合法性
    if (!TIME_RANGE_MAP[num]) {
      console.warn(`无效的时间类型：${num}，默认使用近1天`);
      num = 1;
    }
    const { days } = TIME_RANGE_MAP[num]!;
    // 计算开始时间戳（当前时间 - 天数*24小时）
    const beginTimestamp = Date.now() - 1000 * 60 * 60 * 24 * days;
    // 转换为 yyyy-mm-dd 格式并更新
    setTime({
      begin: formatDate(beginTimestamp),
      end: formatDate(Date.now()),
    });
  };
  useEffect(() => {
    initCharts();
  }, []);
  const getList = async () => {
    if (!time) {
      return;
    }
    console.log("time", time);
    await turnoverStatistics({ begin: time.begin, end: time.end }).then((res) => {
      if (!isSingleCategoryXAxis(turnoveChatOption.xAxis)) {
        return;
      }
      turnoveChatOption.xAxis.data = res.data.dateList;
      if (!isSeriesArray(turnoveChatOption.series)) {
        return;
      }
      turnoveChatOption.series![0].data = [res.data.turnoverList];
      turnoveChatRef.current?.setOption(turnoveChatOption);
    })
    await userStatistics({ begin: time.begin, end: time.end }).then((res) => {
      if (!isSingleCategoryXAxis(userChartOption.xAxis)) {
        return;
      }
      if (!isSingleCategoryXAxis(userChartOption.xAxis)) {
        return;
      }
      userChartOption.xAxis.data = res.data.dateList;
      if (!isSeriesArray(userChartOption.series)) {
        return;
      }
      userChartOption.series![0].data = [res.data.totalUserList];
      userChartOption.series![1].data = [res.data.newUserList];
      userChartRef.current?.setOption(userChartOption);
    })
    await orderStatistics({ begin: time.begin, end: time.end }).then((res) => {
      if (!isSingleCategoryXAxis(orderChartOption.xAxis)) {
        return;
      }
      orderChartOption.xAxis.data = res.data.dateList;
      if (!isSeriesArray(orderChartOption.series)) {
        return;
      }
      orderChartOption.series![0].data = res.data.totalOrderList;
      orderChartOption.series![1].data = res.data.validOrderList;
      orderChartOption.series![2].data = res.data.totalOrderList;
      orderChartOption.series![3].data = res.data.validOrderList;
      orderChartOption.series![4].data = res.data.validOrderRateList;
      orderChartRef.current?.setOption(orderChartOption);
    })
    await topStatistics({ begin: time.begin, end: time.end }).then((res) => {
      if (!isSingleCategoryXAxis(topChartOption.xAxis)) {
        return;
      }
      topChartOption.xAxis.data = res.data.dateList;
      if (!isSeriesArray(topChartOption.series)) {
        return;
      }
      topChartOption.series![0].data = res.data.salesList;
      topChartRef.current?.setOption(topChartOption);
    })
  }
  useEffect(() => {
    getList();
  }, [time]);
  const exportData = () => {
    exportStatisticsData();
    console.log("导出数据");
  }
  return <><Space>
    <Button onClick={() => switchTime(1)}>昨日</Button>
    <Button onClick={() => switchTime(2)}>近7天</Button>
    <Button onClick={() => switchTime(3)}>近30天</Button>
    <Button onClick={() => switchTime(4)}>本周</Button>
    <Button onClick={() => switchTime(5)}>本月</Button>
    已选时间:{time?.begin} - {time?.end}
    <Button onClick={exportData}>数据导出</Button>
  </Space>
    <Row>
      <Col span={12}>
        <Card title={"营业额统计"} style={{ height: "calc(50vh - 100px)" }}>
          <div ref={businessRef} style={{ width: "100%", height: "100%", padding: "0 auto" }}></div>
        </Card>
      </Col>
      <Col span={12}>
        <Card title={"用户统计"} style={{ height: "calc(50vh - 100px)" }}>
          <div ref={userRef} style={{ width: "100%", height: "100%", padding: "0 auto" }}></div>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <Card title={"订单统计"} style={{ height: "calc(50vh - 100px)" }}>
          <div ref={orderRef} style={{ width: "100%", height: "100%", padding: "0 auto" }}></div>
        </Card>
      </Col>
      <Col span={12}>
        <Card title={"销量排名top10"} ref={topRef} style={{ height: "calc(50vh - 100px)" }}>
          <div ref={topRef} style={{ width: "100%", height: "100%", padding: "0 auto" }}></div>
        </Card>
      </Col>
    </Row>
  </>;
};
export default Statistics;
