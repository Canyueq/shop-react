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
import { useEffect, useState, type SyntheticEvent } from "react";
import SetmealShow from "./SetmealShow";
import SetmalAdd from "./SetmealAdd";
import SetmalEdit from "./SetmealEdit";
import { usePagination } from "app/hooks/usePagination";
import type { SetmealTableItem } from "./types/Setmeal";
import type {
  SetmealAddReq,
  SetmealPage,
  SetmealPaginationReq,
  SetmealPaginationRes,
} from "./types/api";
import type { ColumnsType } from "antd/es/table";
import { deleteByIds, page, status } from "app/api/setmeal";
import type { TableRowSelection } from "antd/es/table/interface";
import { formatDateArray } from "app/utils/getFormatTime";
import { getByType } from "app/api/category";
import type { CategoryTableType } from "app/types/routes/category";
const addDishtype = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("新增套餐");
  const { pagination, changePage, changeSize, changeArgs } =
    usePagination<SetmealPage>();
  const [res, setRes] = useState<SetmealPaginationRes>();
  const [selection, setSelection] = useState<SetmealAddReq[]>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();
  const [categoryOptions, setCategoryOptions] = useState();
  const noImg = "";
  const columns: ColumnsType<SetmealAddReq> = [
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
      dataIndex: "categoryId",
      key: "categoryId",
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
      render: (_: any, record: SetmealAddReq) => (
        <div style={{ color: record.status === 1 ? "green" : "red" }}>
          {record.status === 1 ? "启售" : "停售"}
        </div>
      ),
    },
    // 7. 最后操作时间列
    {
      title: "最后操作时间",
      dataIndex: "updateTime",
      key: "updateTime",
      // 如果你需要格式化时间，取消下面注释并引入moment
      render: (updateTime: number[]) => formatDateArray(updateTime),
    },
    // 8. 操作列
    {
      title: "操作",
      key: "action",
      width: 250,
      align: "center" as const, // 对应原align="center"
      render: (_: any, record: SetmealAddReq) => {
        const isStop = record.status === 0;
        return (
          <Space size="small">
            {/* Antd的Space替代原inline布局 */}
            {/* 修改按钮 */}
            <Button
              variant="link"
              color="blue"
              onClick={() => handleEdit(record)}
            >
              修改
            </Button>
            {/* 删除按钮 */}
            <Button
              variant="link"
              color="red"
              onClick={() => handleDelte("单删", record.id as any)}
            >
              删除
            </Button>
            {/* 启售/停售按钮 */}
            <Button
              variant="link"
              color={record.status === 1 ? "red" : "green"}
              onClick={() => handleStatus(record)}
            >
              {isStop ? "启售" : "停售"}
            </Button>
          </Space>
        );
      },
    },
  ];
  const rowSelection: TableRowSelection<SetmealAddReq> = {
    selectedRowKeys,
    onChange: (e) => {
      setSelectedRowKeys(e);
      // console.log(selectedRowKeys);
    },
  };
  const table: TableProps<SetmealAddReq> = {
    rowSelection: { ...rowSelection },
    columns: columns,
    rowKey: "id",
    dataSource: res?.data.records,
    scroll: { y: 420 },
    pagination: {
      current: pagination.page,
      pageSize: pagination.pageSize,
      onChange: (current, pageSize) => {
        (changePage(current), changeSize(pageSize));
      },
    },
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("e", typeof e);
    const args: SetmealPage = {
      ...pagination,
      name: e.target.value,
    };
    changeArgs(args);
  };
  const handleCategorySelect = (e: number) => {
    // console.log("e", e);
    const args: SetmealPage = {
      ...pagination,
      categoryId: e,
    };
    changeArgs(args);
  };
  const handleStatusSelect = (e: number) => {
    // console.log("e", e);
    const args = {
      ...pagination,
      status: e,
    };
    changeArgs(args);
  };
  const handleDelte = async (type: string, ids: number[]) => {
    if (type !== "批量删除") {
      await deleteByIds(ids.toString());
      getList();
    } else {
      const strIds = ids.map((id) => id).join(",");
      console.log("批量删除", strIds);
      await deleteByIds(strIds);
      getList();
    }
  };
  const handleEdit = (record: SetmealAddReq) => {
    setTitle("编辑套餐");
    setOpen(true);
    setSelection([record]);
  };
  const handleStatus = async (record: SetmealAddReq) => {
    const data = record.status === 1 ? 0 : 1;
    await status(data, record.id!).then(() => {
      getList();
    });
  };
  const getList = async () => {
    await page(pagination).then((res) => {
      console.log("res", res);
      setRes(res);
    });
  };
  useEffect(() => {
    getList();
  }, [pagination]);
  useEffect(() => {
    (async () => {
      await getByType(2).then((res) => {
        // console.log("category", res);
        res.data.map((item: any) => {
          item.value = item.id;
          item.label = item.name;
          item.key = item.id;
        });
        setCategoryOptions(res.data);
      });
    })();
  }, []);
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
                <Input
                  placeholder="请输入套餐名称"
                  onChange={handleNameChange}
                />
              </Form.Item>
              <Form.Item
                layout="horizontal"
                name="categoryId"
                label="套餐分类"
                style={{ width: "180px" }}
              >
                <Select
                  placeholder="请选择"
                  options={categoryOptions}
                  onSelect={handleCategorySelect}
                />
              </Form.Item>
              <Form.Item
                layout="horizontal"
                name="status"
                label="状态"
                style={{ width: "150px" }}
              >
                <Select
                  placeholder="请选择"
                  options={[
                    { label: "启售", value: 1, key: 1 },
                    { label: "停售", value: 0, key: 0 },
                  ]}
                  onSelect={handleStatusSelect}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={() => getList()}>
                  查询
                </Button>
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
                    const ids: number[] = [];
                    if (!selectedRowKeys) return;
                    console.log("click");
                    selectedRowKeys?.forEach((item) => ids.push(item as any));
                    handleDelte("批量删除", ids);
                  }}
                >
                  批量删除
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setTitle("新增套餐");
                    setOpen(true);
                  }}
                >
                  新增
                </Button>
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
            <SetmalEdit id={selection?.[0].id!} close={() => setOpen(false)} />
          )}
        </SetmealShow>
      )}
    </>
  );
};
export default addDishtype;
