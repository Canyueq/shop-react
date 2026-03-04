import { Row, Col, Button, Space, Table, type TableProps } from "antd";
import { formatDate } from "app/utils/getFormatTime";
import {
    businessData,
    orderOverView,
    dishOverView,
    setmealOverView
} from "./api";
import styles from "./style.module.css";
import { useState, useEffect } from "react";

const Dashboard = () => {
    const [businessViewData, setBusinessViewData] = useState<BusinessDataRes>()
    const [orderOverViewData, setOrderOverViewData] = useState<OrderOverViewRes>()
    const [dishOverViewData, setDishOverViewData] = useState<DishOverViewRes>()
    const [setmealOverViewData, setSetmealOverViewData] = useState<SetmealOverViewRes>()
    useEffect(() => {
        businessData().then((res) => {
            setBusinessViewData(res.data)
        })
        orderOverView().then((res) => {
            setOrderOverViewData(res.data)
        })
        dishOverView().then((res) => {
            setDishOverViewData(res.data)
        })
        setmealOverView().then((res) => {
            setSetmealOverViewData(res.data)
        })
    }, [])
    const tableProps: TableProps = {
        columns: [{
            title: "订单号",
            dataIndex: "orderId",
            key: "orderId",
        }, {
            title: "订单菜品",
            dataIndex: "orderDish",
            key: "orderDish",
        },
        {
            title: "地址",
            dataIndex: "address",
            key: "address",
        }, {
            title: "预计送达时间",
            dataIndex: "expectedDeliveryTime",
            key: "expectedDeliveryTime",
        },
        {
            title: "实收金额",
            dataIndex: "actualAmount",
            key: "actualAmount",
        },
        {
            title: "备注",
            dataIndex: "remark",
            key: "remark",
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text, record) => (
                <Space>
                    <Button type="default">接单</Button>
                    <Button type="default">拒单</Button>
                    <Button type="default">查看</Button>
                </Space>
            ),
        }
        ],
        dataSource: [],
        scroll: {
            y: 150,
        },
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
        },
    }
    return (
        <>
            <div className={styles.dashboardItem}>
                <Space>
                    <div>今日数据 {formatDate(Date.now())}</div>
                    <Button type="default">详细数据</Button>
                </Space>
                <div>
                    <Space>
                        <div>
                            营业额
                            <div>¥{businessViewData?.turnover}</div>
                        </div>
                        <div>
                            有效订单
                            <div>{businessViewData?.validOrderCount}</div>
                        </div>
                        <div>
                            订单完成率
                            <div>{businessViewData?.orderCompletionRate}</div>
                        </div>
                        <div>
                            平均客单价
                            <div>¥{businessViewData?.unitPrice}</div>
                        </div>
                        <div>
                            新增用户数
                            <div>{businessViewData?.newUsers}</div>
                        </div>
                    </Space>
                </div>
            </div>
            <div className={styles.dashboardItem}>
                <Space>
                    <div>订单管理 {formatDate(Date.now())}</div>
                    <Button type="default">订单明细</Button>
                </Space>
                <div>
                    <Space>
                        <div>
                            待接单
                            <div>{orderOverViewData?.waitingOrders}</div>
                        </div>
                        <div>
                            待派送
                            <div>{orderOverViewData?.deliveredOrders}</div>
                        </div>
                        <div>
                            已完成
                            <div>{orderOverViewData?.completedOrders}</div>
                        </div>
                        <div>
                            已取消
                            <div>{orderOverViewData?.cancelledOrders}</div>
                        </div>
                        <div>
                            全部订单
                            <div>{orderOverViewData?.allOrders}</div>
                        </div>
                    </Space>
                </div>
            </div>
            <Row>
                <Col span={12}>
                    <div className={styles.dashboardItem}>
                        <Space>
                            <div>菜品总览</div>
                            <Button type="default">菜品管理</Button>
                        </Space>
                        <div>
                            <Space>
                                <div>
                                    已启售
                                    <div>{dishOverViewData?.sold}</div>
                                </div>
                                <div>
                                    已停售
                                    <div>{dishOverViewData?.discontinued}</div>
                                </div>
                                <Button type="default">新增菜品</Button>
                            </Space>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className={styles.dashboardItem}>
                        <Space>
                            <div>套餐总览</div>
                            <Button type="default">套餐管理</Button>
                        </Space>
                        <div>
                            <Space>
                                <div>
                                    已启售
                                    <div>{setmealOverViewData?.sold}</div>
                                </div>
                                <div>
                                    已停售
                                    <div>{setmealOverViewData?.discontinued}</div>
                                </div>
                                <Button type="default">新增套餐</Button>
                            </Space>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className={styles.dashboardItem}>
                <Space>
                    <div>用户管理</div>
                    <Button type="default">待接单</Button>
                    <Button type="default">待派送</Button>
                </Space>
                <Table {...tableProps} />
            </div>
        </>
    );
};
export default Dashboard;