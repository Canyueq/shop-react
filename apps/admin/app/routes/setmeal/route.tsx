import {
  Button,
  Form,
  Image,
  Input,
  Select,
  Table,
  Space,
  type TableProps,
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import SetmealShow from "./SetmealShow";
import SetmalAdd from "./SetmealAdd";
import SetmalEdit from "./SetmealEdit";
import { usePagination } from "app/hooks/usePagination";
import type { SetmealTableItem } from "./types/Setmeal";
import type { SetmealPaginationReq, SetmealPaginationRes } from "./types/api";
import type { ColumnsType } from "antd/es/table";
import { deleteByIds, page } from "app/api/setmeal";
import type { TableRowSelection } from "antd/es/table/interface";
const mockTabelList = [
  {
    id: 1,
    name: "string", // 套餐名称
    image: "string", // 图片地址
    categoryName: "string", // 套餐分类
    price: 11, // 套餐价格
    status: 1, // 0-停售 1-启售
    updateTime: "string", // 最后操作时间
  },
  {
    id: 2,
    name: "string", // 套餐名称
    image: "string", // 图片地址
    categoryName: "string", // 套餐分类
    price: 11, // 套餐价格
    status: 1, // 0-停售 1-启售
    updateTime: "string", // 最后操作时间
  },
  {
    id: 3,
    name: "string", // 套餐名称
    image: "string", // 图片地址
    categoryName: "string", // 套餐分类
    price: 11, // 套餐价格
    status: 1, // 0-停售 1-启售
    updateTime: "string", // 最后操作时间
  },
  {
    id: 4,
    name: "string", // 套餐名称
    image: "string", // 图片地址
    categoryName: "string", // 套餐分类
    price: 11, // 套餐价格
    status: 1, // 0-停售 1-启售
    updateTime: "string", // 最后操作时间
  },
  {
    id: 5,
    name: "string", // 套餐名称
    image: "string", // 图片地址
    categoryName: "string", // 套餐分类
    price: 11, // 套餐价格
    status: 1, // 0-停售 1-启售
    updateTime: "string", // 最后操作时间
  },
  {
    id: 6,
    name: "string", // 套餐名称
    image: "string", // 图片地址
    categoryName: "string", // 套餐分类
    price: 11, // 套餐价格
    status: 1, // 0-停售 1-启售
    updateTime: "string", // 最后操作时间
  },
  {
    id: 7,
    name: "string", // 套餐名称
    image: "string", // 图片地址
    categoryName: "string", // 套餐分类
    price: 11, // 套餐价格
    status: 1, // 0-停售 1-启售
    updateTime: "string", // 最后操作时间
  },
];
const addDishtype = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("新增套餐");
  const { pagination, changePage, changeSize, changeArgs } =
    usePagination<SetmealPaginationReq>();
  const [res, setRes] = useState<SetmealPaginationRes>();
  const [selection, setSelection] = useState<SetmealTableItem[]>();
  const noImg = "";
  const columns: ColumnsType<SetmealTableItem> = [
    // 1. 选择列（对应原type="selection"）
    // 2. 套餐名称列
    {
      title: "套餐名称", // 对应原label
      dataIndex: "name", // 对应原prop
      key: "name",
    },
    // 3. 图片列（自定义渲染）
    {
      title: "图片",
      dataIndex: "image",
      key: "image",
      // 自定义渲染图片（对应原slot-scope）
      render: (imageUrl: string) => (
        <Image
          width={80}
          height={40}
          src={imageUrl}
          style={{ border: "none", cursor: "pointer" }}
          // 图片加载失败时显示占位图（对应原slot="error"）
          fallback={noImg}
          // 关闭默认预览（如果需要预览可以开启）
          preview={false}
        />
      ),
    },
    // 4. 套餐分类列
    {
      title: "套餐分类",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    // 5. 套餐价列（价格格式化）
    {
      title: "套餐价",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span>￥{(((price.toFixed(2) as any) * 100) / 100).toFixed(2)}</span>
      ),
    },
    // 6. 售卖状态列（自定义样式+文本）
    {
      title: "售卖状态",
      key: "status", // 非数据列需要手动指定key
      render: (_: any, record: SetmealTableItem) => {
        const isStop = record.status === 0;
        return (
          <div className={`tableColumn-status ${isStop ? "stop-use" : ""}`}>
            {isStop ? "停售" : "启售"}
          </div>
        );
      },
    },
    // 7. 最后操作时间列
    {
      title: "最后操作时间",
      dataIndex: "updateTime",
      key: "updateTime",
      // 如果你需要格式化时间，取消下面注释并引入moment
      // render: (updateTime: string) => moment(updateTime).format('YYYY-MM-DD h:m:s'),
    },
    // 8. 操作列
    {
      title: "操作",
      key: "action",
      width: 250,
      align: "center" as const, // 对应原align="center"
      render: (_: any, record: SetmealTableItem) => {
        const isStop = record.status === 0;
        return (
          <Space size="small">
            {" "}
            {/* Antd的Space替代原inline布局 */}
            {/* 修改按钮 */}
            <Button
              type="text"
              size="small"
              className="blueBug"
              onClick={() => handleEdit(record)}
            >
              修改
            </Button>
            {/* 删除按钮 */}
            <Button
              type="text"
              size="small"
              className="delBut"
              onClick={() => handleDelte("单删", record.id as any)}
            >
              删除
            </Button>
            {/* 启售/停售按钮 */}
            <Button
              type="text"
              size="small"
              className={`non ${isStop ? "blueBug" : "delBut"}`}
              onClick={() => handleStatus(record)}
            >
              {isStop ? "启售" : "停售"}
            </Button>
          </Space>
        );
      },
    },
  ];
  const rowSelection: TableRowSelection<SetmealTableItem> = {};
  const table: TableProps<SetmealTableItem> = {
    rowSelection: { ...rowSelection },
    columns: columns,
    dataSource: mockTabelList,
    scroll: { y: 420 },
    pagination: {
      current: pagination.page,
      pageSize: pagination.pageSize,
      onChange: (current, pageSize) => {
        (changePage(current), changeSize(pageSize));
      },
    },
  };
  const handleDelte = async (type: string, ids: number[]) => {
    if (type !== "批量删除") {
      await deleteByIds(ids.toString());
    } else {
      const strIds = ids.map((id) => id).join(",");
      await deleteByIds(strIds);
    }
  };
  const handleEdit = (record: SetmealTableItem) => {};
  const handleStatus = (record: SetmealTableItem) => {};
  const getList = async () => {
    // await page(pagination).then((res) => {
    //   setRes(res);
    // });
  };
  useEffect(() => {
    getList();
  }, [pagination]);
  return (
    <>
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={20}>
            <Space size={16}>
              <Form.Item
                layout="horizontal"
                name="name"
                label="套餐名称"
                style={{ width: "200px" }}
              >
                <Input placeholder="请输入套餐名称" />
              </Form.Item>
              <Form.Item
                layout="horizontal"
                name="category"
                label="套餐分类"
                style={{ width: "180px" }}
              >
                <Select placeholder="请选择" />
              </Form.Item>
              <Form.Item
                layout="horizontal"
                name="status"
                label="状态"
                style={{ width: "150px" }}
              >
                <Select placeholder="请选择" />
              </Form.Item>
              <Form.Item>
                <Button type="primary">查询</Button>
              </Form.Item>
            </Space>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Space size={12} style={{ float: "right" }}>
                <Button
                  type="link"
                  danger
                  onClick={() => {
                    let ids: number[];
                    if (!selection) return;
                    handleDelte(
                      "批量删除",
                      (ids = selection?.map((item) => item.id)),
                    );
                  }}
                >
                  批量删除
                </Button>
                <Button type="primary">新增</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table {...table} />
      {open && (
        <SetmealShow open={open} title={title}>
          {title === "新增套餐" ? (
            <SetmalAdd close={() => setOpen(false)} />
          ) : (
            <SetmalEdit />
          )}
        </SetmealShow>
      )}
    </>
  );
};
export default addDishtype;
