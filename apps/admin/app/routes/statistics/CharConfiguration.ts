const turnoveChatOption: echarts.EChartsOption = {
    xAxis: {
        type: "category",
        data: ["日期", "日期"],
    },
    yAxis: {
        type: "value",
        name: "用户数",
    },
    series: [
        {
            type: 'line',
            name: '营业额',
            data: [],
        }
    ],
    data: [],
    type: "line",
}
const userChartOption: echarts.EChartsOption = {
    xAxis: {
        type: "category",
        data: ["日期", "日期"],
    },
    yAxis: {
        type: "value",
        name: "用户数",
    },
    series: [
        {
            type: 'line',
            name: '总用户数',
            data: [],
        },
        {
            type: 'line',
            name: '新用户数',
            data: [],
        },
    ],
    data: [],
    type: "line",
}
const orderChartOption: echarts.EChartsOption = {
    xAxis: {
        type: "category",
        data: ["日期", "日期"],
    },
    yAxis: {
        type: "value",
        name: "订单数",
    },
    series: [
        {
            type: 'line',
            name: '每日订单数',
            data: [],
        },
        {
            type: 'line',
            name: '每日有效订单数',
            data: [],
        },
        {
            type: 'line',
            name: '总订单数',
            data: [],
        },
        {
            type: 'line',
            name: '有效订单数',
            data: [],
        },
        {
            type: 'line',
            name: '有效订单率',
            data: [],
        }
    ],
    data: [],
    type: "line",
}
const topChartOption: echarts.EChartsOption = {
    xAxis: {
        type: "category",
        data: ["商品名称", "商品名称"],
    },
    yAxis: {
        type: "value",
        name: "销售量",
    },
    series: [
        {
            type: 'line',
            name: '销售量',
            data: [],
        },
    ],
    data: [],
    type: "line",
}
// 关键：添加数字索引签名 [key: number]: { days: number; label: string; } | undefined
const TIME_RANGE_MAP: {
    [key: number]: { days: number; label: string; } | undefined; // 数字索引签名
    1: { days: number; label: string; };
    2: { days: number; label: string; };
    3: { days: number; label: string; };
    4: { days: number; label: string; };
    5: { days: number; label: string; };
} = {
    1: { days: 1, label: '近1天' },
    2: { days: 7, label: '近7天' },
    3: { days: 30, label: '近30天' },
    4: { days: 90, label: '近90天' },
    5: { days: 180, label: '近半年' },
};

export { turnoveChatOption, userChartOption, orderChartOption, topChartOption, TIME_RANGE_MAP }; 
