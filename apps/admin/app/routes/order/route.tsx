import {
  Button,
  Form,
  Input,
  Table,
  Space,
  type TableProps,
  Row,
  Col,
  DatePicker,
  Tabs,
  Badge,
} from "antd";
import { useEffect, useState } from "react";
import { usePagination } from "app/hooks/usePagination";
import type { OrderTableItem } from "./types/Order";
import type {
  OrdersPageQueryDTO,
  OrderPaginationData,
} from "./types/api";
import type { BasePaginationRes, BaseRes } from "app/types/global";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { formatDateArray } from "app/utils/getFormatTime";
import type { RangePickerProps } from "antd/es/date-picker";

import {
  conditionSearch,
  complete as completeOrder,
  cancel as cancelOrder,
} from "app/api/order";

const Order: React.FC = () => {
  const [form] = Form.useForm();
  const { pagination, changePage, changeSize, changeArgs } = usePagination<OrdersPageQueryDTO>();
  const [res, setRes] = useState<BaseRes<BasePaginationRes<OrderTableItem>>>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();
  const [activeTab, setActiveTab] = useState(0);

  const columns: ColumnsType<OrderTableItem> = [
    {
      title: "订单号",
      dataIndex: "number",
      key: "number",
      width: 150,
      ellipsis: true,
    },
    {
      title: "订单菜品",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
      width: 250,
      ellipsis: true,
    },
    {
      title: "预计送达时间",
      dataIndex: "estimatedDeliveryTime",
      key: "estimatedDeliveryTime",
      width: 180,
      render: (time: number[]) => formatDateArray(time),
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      width: 120,
      ellipsis: true,
    },
    {
      title: "餐具数量",
      dataIndex: "tablewareQuantity",
      key: "tablewareQuantity",
      width: 80,
      align: "center" as const,
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      align: "center" as const,
      render: (_: any, record: OrderTableItem) => {
        return (
          <Space size="middle">
            <Button
              variant="link"
              color="blue"
              onClick={() => handleComplete(record)}
              disabled={record.status !== 3}
            >
              完成
            </Button>
            <Button
              variant="link"
              color="red"
              onClick={() => handleCancel(record)}
              disabled={record.status !== 1}
            >
              取消
            </Button>
            <Button
              variant="link"
              color="blue"
              size="small"
              onClick={() => handleDetail(record)}
            >
              详情
            </Button>
          </Space>
        );
      },
    },
  ];

  const rowSelection: TableRowSelection<OrderTableItem> = {
    selectedRowKeys,
    onChange: (e) => {
      setSelectedRowKeys(e);
    },
  };

  const table: TableProps<OrderTableItem> = {
    rowSelection: { ...rowSelection },
    columns: columns,
    rowKey: "id",
    dataSource: res?.data.records || [],
    scroll: { x: 1200, y: 420 },
    pagination: {
      current: pagination.page,
      pageSize: pagination.pageSize,
      total: res?.data.total,
      onChange: (current, pageSize) => {
        changePage(current);
        changeSize(pageSize);
      },
    },
  };

  const handleOrderNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const args: OrdersPageQueryDTO = {
      ...pagination,
      number: e.target.value,
    };
    changeArgs(args);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const args: OrdersPageQueryDTO = {
      ...pagination,
      phone: e.target.value,
    };
    changeArgs(args);
  };

  const handleTimeChange: RangePickerProps['onChange'] = (dates) => {
    if (dates && dates.length === 2) {
      const beginTime = dates[0]?.format('YYYY-MM-DD HH:mm:ss') || '';
      const endTime = dates[1]?.format('YYYY-MM-DD HH:mm:ss') || '';
      const args: OrdersPageQueryDTO = {
        ...pagination,
        beginTime,
        endTime,
      };
      changeArgs(args);
    }
  };

  const handleTabChange = (key: string) => {
    const statusMap: Record<string, number> = {
      "0": 0,
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
    };
    const status = statusMap[key] || 0;
    const args: OrdersPageQueryDTO = {
      ...pagination,
      status,
    };
    changeArgs(args);
    setActiveTab(Number(key));
  };

  const handleComplete = async (record: OrderTableItem) => {
    await completeOrder(record.id).then(() => {
      getList();
    });
  };

  const handleCancel = async (record: OrderTableItem) => {
    await cancelOrder({ id: record.id, cancelReason: "用户取消" }).then(() => {
      getList();
    });
  };

  const handleDetail = (record: OrderTableItem) => {
    // 查看订单详情
    console.log("查看订单详情", record);
  };

  const getList = async () => {
    await conditionSearch(pagination).then((res) => {
      setRes(res);
      console.log("res", res);
    });
  };

  useEffect(() => {
    getList();
  }, [pagination]);

  // Tabs标签页配置
  const tabsItems = [
    { key: "0", label: "全部订单" },
    { key: "1", label: "待接单" },
    { key: "2", label: "待派送" },
    { key: "3", label: <><Badge count={0} style={{ backgroundColor: '#1890ff' }} /> 派送中</> },
    { key: "4", label: "已完成" },
    { key: "5", label: "已取消" },
  ];

  return (
    <>
      <Tabs activeKey={activeTab.toString()} onChange={handleTabChange} type="card" items={tabsItems} />

      <Form form={form} layout="vertical" style={{ marginTop: 0, background: '#fff', padding: '16px', borderRadius: '8px' }}>
        <Row gutter={24}>
          <Col span={24}>
            <Space size={16} align="center">
              <Form.Item
                layout="horizontal"
                name="number"
                label="订单号"
                style={{ marginBottom: 0, width: "200px" }}
              >
                <Input
                  placeholder="请输入订单号"
                  onChange={handleOrderNumberChange}
                  style={{ borderRadius: '4px' }}
                />
              </Form.Item>
              <Form.Item
                layout="horizontal"
                name="phone"
                label="手机号"
                style={{ marginBottom: 0, width: "200px" }}
              >
                <Input
                  placeholder="请输入手机号"
                  onChange={handlePhoneChange}
                  style={{ borderRadius: '4px' }}
                />
              </Form.Item>
              <Form.Item
                layout="horizontal"
                name="timeRange"
                label="下单时间"
                style={{ marginBottom: 0, width: "300px" }}
              >
                <DatePicker.RangePicker
                  placeholder={["开始日期", "结束日期"]}
                  onChange={handleTimeChange}
                  style={{ borderRadius: '4px' }}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" onClick={() => getList()} style={{ borderRadius: '4px' }}>
                  查询
                </Button>
              </Form.Item>
            </Space>
          </Col>
        </Row>
      </Form>

      <Table
        {...table}
        style={{ marginTop: 16, background: '#fff', borderRadius: '8px' }}
        pagination={{
          ...table.pagination,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        bordered
      />
    </>
  );
};

export default Order;
