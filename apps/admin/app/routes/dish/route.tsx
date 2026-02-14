import { Space, Button, Table, Input, Select } from "antd";
import { getById, setStatus, update } from "app/api/dish";
import { deleteById, page } from "app/api/dish";
import { usePagination } from "app/hooks/usePagination";
import type { DishPage, DishPageRes } from "app/types/api/dish";
import { useEffect, useState } from "react";
import { DishShow } from "./DishShow";
import DishAdd from "./DishAdd";
import DishEdit from "./DishEdit";
import type { CategoryTableType } from "app/types/routes/category";
import { getByType } from "app/api/category";
import type { TableColumnsType, TableProps } from "antd";
import { formatDateArray } from "app/utils/getFormatTime";
type ListItem = { label: string; value: number };
const Dish = () => {
  let options: ListItem[] = [];
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox",
  );
  const [selection, setSelection] = useState<DishType>();
  const [selections, setSelections] = useState<DishType[]>();
  const [open, setOpen] = useState<boolean>();
  const { pagination, changePage, changeSize, changeArgs } =
    usePagination<DishPage>();
  const [res, SetRes] = useState<DishPageRes>();
  const [title, setTitle] = useState<string>("新建菜品");
  const [categoryList, setCategoryList] = useState<ListItem[]>();
  const columns: any = [
    {
      title: "菜品名称", // antd Table 列配置用 title 而非 label
      dataIndex: "name", // antd Table 用 dataIndex 而非 value
      key: "name",
      fixed: "start",
    },
    {
      title: "图片",
      dataIndex: "image",
      key: "image",
      render: (img: string) =>
        img ? <img src={img} width="50" alt="菜品" /> : "无图片",
    },
    {
      title: "菜品分类",
      dataIndex: "categoryName",
      key: "categoryName",
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
      render: (updateTime: number[]) => <>{formatDateArray(updateTime)}</>,
    },
    {
      title: "操作",
      key: "operation", // 避免与 name 重复
      fixed: "end",
      render: (selection: DishType) => (
        <Space>
          <Button
            variant="link"
            color="blue"
            onClick={() => {
              setTitle("修改菜品");
              setSelection(selection);
              handleEdit(selection);
            }}
          >
            修改
          </Button>
          <Button
            variant="link"
            color="red"
            onClick={() => {
              handleDelete(selection.id);
            }}
          >
            删除
          </Button>
          <Button
            variant="link"
            color={selection.status === 1 ? "red" : "green"}
            onClick={() =>
              handleStatusToggle(
                (selection.status = selection.status === 1 ? 0 : 1),
                selection.id,
              )
            }
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
  const handleDelete = async (id?: number) => {
    console.log("id", id);
    if (id) {
      await deleteById(id.toString());
      getList();
      return;
    }
    const ids = selections?.map((item) => item.id).join(",");
    console.log(ids);
    if (!ids) return;
    await deleteById(ids);
    getList();
  };
  const handleEdit = async (data: DishType) => {
    await getById(data.id).then((res) => setSelection(res.data));
    setOpen(true);
  };
  const handleStatusToggle = async (status: number, id: number) => {
    await setStatus(status, id);
    getList();
  };
  const handleSubmit = () => {
    getList();
    setOpen(false);
  };
  const getList = async () => {
    await page(pagination).then((res: DishPageRes) => {
      SetRes(res);
    });
  };
  const rowSelection: TableProps<any>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows,
      );
      setSelections(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };
  const getCategory = async () => {
    await getByType(1).then((res) => {
      const data: CategoryTableType[] = res.data;
      console.log(data);
      data.forEach((item) => {
        let listItem: ListItem = { label: "", value: 0 };
        listItem.label = item.name || "";
        listItem.value = item.id || 0;
        options.push(listItem);
      });
      setCategoryList(options);
      console.log(options);
    });
  };
  useEffect(() => {
    getCategory();
    getList();
  }, [pagination]);
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
            options={categoryList}
            onSelect={(value) => {
              const args = {
                ...pagination,
                categoryId: value,
              };
              changeArgs(args);
            }}
          />
          <div>售卖状态：</div>
          <Select<number>
            placeholder="请选择"
            options={[
              { value: 1, label: "启售" },
              { value: 0, label: "停售" },
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
          <Button variant="link" color="red" onClick={() => handleDelete()}>
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
        dataSource={res?.data.records}
        rowKey={"id"}
        scroll={{ y: 420 }}
        rowSelection={{ type: selectionType, ...rowSelection }}
        pagination={{
          total: res?.data.total,
          showSizeChanger: true,
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
            <DishEdit
              onOK={handleSubmit}
              onCancel={handleCancel}
              data={selection}
            />
          )}
        </DishShow>
      )}
    </>
  );
};
export default Dish;
