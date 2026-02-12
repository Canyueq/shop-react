import { Space, Button, Table, Input, Select } from "antd";
import { setStatus, update } from "app/api/dish";
import { deleteById, page } from "app/api/dish";
import { usePagination } from "app/hooks/usePagination";
import type { DishPage, DishPageRes } from "app/types/api/dish";
import { useState } from "react";
import type Category from "../categoty/route";
import { DishShow } from "./DishShow";
import DishAdd from "./DishAdd";
import DishEdit from "./DishEdit";
const Dish = () => {
  const [selection, setSelection] = useState<DishType>();
  const [open, setOpen] = useState<boolean>();
  const { pagination, changePage, changeSize, changeArgs } =
    usePagination<DishPage>();
  const [res, SetRes] = useState<DishPageRes>();
  const [title, setTitle] = useState<string>("新建菜品");
  const columns = [
    {
      title: "菜品名称", // antd Table 列配置用 title 而非 label
      dataIndex: "name", // antd Table 用 dataIndex 而非 value
      key: "name",
    },
    {
      title: "图片",
      dataIndex: "img",
      key: "img",
      render: (img: string) =>
        img ? <img src={img} width="50" alt="菜品" /> : "无图片",
    },
    {
      title: "菜品分类",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "售价",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: "售卖状态",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <span style={{ color: status === 1 ? "green" : "red" }}>
          {status === 1 ? "启售" : "停售"}
        </span>
      ),
    },
    {
      title: "最后操作",
      dataIndex: "updateTime",
      key: "updateTime",
    },
    {
      title: "操作",
      key: "operation", // 避免与 name 重复
      render: (selection: DishType) => (
        <Space size="small">
          <Button
            variant="link"
            color="blue"
            onClick={() => {
              setSelection(selection);
              handleEdit(selection);
            }}
          >
            修改
          </Button>
          <Button
            variant="link"
            color="blue"
            onClick={() => {
              setTitle("修改菜品");
              handleDelete(selection.id);
            }}
          >
            删除
          </Button>
          <Button
            variant="link"
            color={selection.status === 1 ? "red" : "green"}
            onClick={() => handleStatusToggle(selection.status, selection.id)}
          >
            {selection.status === 1 ? "停售" : "启售"}
          </Button>
        </Space>
      ),
    },
  ];
  const handleCancel = () => {
    setOpen(false);
  };
  const handleDelete = async (id: number) => {
    await deleteById(id);
  };
  const handleEdit = (data: DishType) => {
    setSelection(data);
    setOpen(true);
  };
  const handleStatusToggle = async (status: number, id: number) => {
    await setStatus(status, id);
  };
  const handleSubmit = () => {
    setOpen(false);
  };
  const getList = async () => {
    await page(pagination).then((res: DishPageRes) => {
      SetRes(res);
    });
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Space>
          <div>菜品名称：</div>
          <Input
            placeholder="请填写菜品名称"
            value={pagination.name}
            onChange={(e) => {
              const args = {
                ...pagination,
                name: e.target.value,
              };
              changeArgs(args);
            }}
          />
          <div>菜品分类：</div>
          <Select<number>
            placeholder="请选择"
            options={[{ value: 1, label: "" }]}
            onSelect={(value) => {
              const args = {
                ...pagination,
                category: value,
              };
              changeArgs(args);
            }}
          />
          <div>售卖状态：</div>
          <Select<number>
            placeholder="请选择"
            options={[
              { value: 1, label: "启售" },
              { value: 2, label: "停售" },
            ]}
            onSelect={(value) => {
              const args = {
                ...pagination,
                status: value,
              };
              changeArgs(args);
            }}
          />
          <Button onClick={() => getList()}>查询</Button>
        </Space>
        <div>
          <Button variant="link" color="red">
            批量删除
          </Button>
          <Button
            onClick={() => {
              setTitle("新建菜品");
              setOpen(true);
            }}
          >
            +新建菜品
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          onChange: (current, pageSize) => {
            changePage(current);
            changeSize(pageSize);
          },
        }}
      />
      {open && (
        <DishShow open={open} title={title}>
          {title === "新建菜品" ? (
            <DishAdd onOK={handleSubmit} onCancel={handleCancel} />
          ) : (
            <DishEdit onOK={handleSubmit} onCancel={handleCancel} />
          )}
        </DishShow>
      )}
    </>
  );
};
export default Dish;
