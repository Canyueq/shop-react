import { Input, Button, Table, Space, Select, message } from "antd";
import { useEffect, useState } from "react";
import {
  deleteCategory,
  getCategoryPagination,
  forbindCategory,
} from "app/api/category";
import type { CategoryTableType } from "app/types/routes/category";
import type {
  CategoryPagination,
  CategoryPaginationRes,
} from "app/types/api/category";
import { usePagination } from "app/hooks/usePagination";
import CategoryShow from "./show";
import CategoryAdd from "./CategoryAdd";
import CateGoryEdit from "./CategoryEdit";
import { formatDateArray } from "../../utils/getFormatTime";
const Category = () => {
  const [selection, onSelect] = useState<CategoryTableType>();
  const { pagination, changePage, changeSize, changeArgs } =
    usePagination<CategoryPagination>();
  const [res, setRes] = useState<CategoryPaginationRes>();
  const [open, setOpen] = useState(false);
  const ok = () => {
    setOpen(false);
  };
  const oncancel = () => {
    setOpen(false);
  };
  const column = [
    {
      title: "分类名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "分类类型",
      dataIndex: "type",
      key: "type",
      render: (type: number) => {
        return type === 2 ? "菜品分类" : "套餐分类";
      },
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        return (
          <div style={{ color: status === 1 ? "green" : "red" }}>
            {status === 1 ? "启用" : "禁用"}
          </div>
        );
      },
    },
    {
      title: "操作时间",
      dataIndex: "updateTime",
      key: "updateTime",
      render: (updateTime: number[]) => formatDateArray(updateTime),
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_: any, selection: CategoryTableType) => (
        <>
          <Button
            type="link"
            color="blue"
            onClick={() => {
              onSelect(() => {
                return selection;
              });
              setOpen(true);
            }}
          >
            修改
          </Button>
          <Button
            variant="link"
            color="red"
            onClick={async () => {
              await deleteCategory(selection.id!)
                .then(() => {
                  message.success(`已成功删除${selection.name}`);
                })
                .catch((e) => message.error("错误信息", e));
              onSelect(() => {
                return selection;
              });
            }}
          >
            删除
          </Button>
          <Button
            variant="link"
            color={selection.status === 1 ? "red" : "green"}
            onClick={async () => {
              onSelect(() => {
                return selection;
              });
              return await forbindCategory(
                selection.status === 1 ? 0 : 1,
                selection.id!,
              ).then(() => {
                message.success(
                  `已${selection.status === 1 ? "禁用" : "启用"}${selection.name}`,
                );
                getList();
              });
            }}
          >
            {selection.status === 1 ? "禁用" : "启用"}
          </Button>
        </>
      ),
    },
  ];
  const getList = async () => {
    await getCategoryPagination(pagination)
      .then((result) => {
        setRes(() => {
          return result;
        });
      })
      .catch((e) => {
        message.error("获取分类列表失败", e);
      });
    // console.log("res", res);
  };
  useEffect(() => {
    getList();
  }, [pagination, open, selection]);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Space>
          <span>分类名称</span>
          <Input
            placeholder="请填写分类名称"
            className="inputSearch"
            value={pagination.name}
            onChange={(e) => {
              const change: CategoryPagination = {
                type: pagination.type,
                name: e.target.value,
              };
              changeArgs(change);
            }}
          />
          <span>分类类型</span>
          <Select
            placeholder="请选择分类类型"
            className="inputSearch"
            value={pagination.type}
            options={[
              { label: "菜品分类", value: 2 },
              { label: "套餐分类", value: 1 },
            ]}
            onSelect={(e) => {
              const change: CategoryPagination = {
                name: pagination.name,
                type: e,
              };
              changeArgs(change);
            }}
          />
          <Button type="primary" onClick={() => getList()}>
            查询
          </Button>
        </Space>
        <div>
          <Button
            type="primary"
            onClick={() => {
              onSelect(() => {
                const select: CategoryTableType = {
                  type: 1,
                };
                return select;
              });
              setOpen(true);
            }}
          >
            新增菜品分类
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onSelect(() => {
                const select: CategoryTableType = {
                  type: 2,
                };
                return select;
              });
              setOpen(true);
            }}
          >
            新增套餐分类
          </Button>
        </div>
      </div>
      <div style={{ height: "100%", width: "100%" }}>
        <Table
          size="small"
          columns={column}
          rowKey={"id"}
          dataSource={res?.data.records}
          pagination={{
            total: res?.data.total,
            current: pagination.page,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            onChange: (page, size) => {
              changePage(page);
              changeSize(size);
            },
          }}
          scroll={{ y: 420 }}
        />
      </div>
      {open && (
        <CategoryShow
          title={selection?.type === 1 ? "菜品分类" : "套餐分类"}
          open={open}
        >
          {!selection?.name ? (
            <CategoryAdd onOk={ok} onCancel={oncancel} type={selection?.type} />
          ) : (
            <CateGoryEdit
              onOk={ok}
              onCancel={oncancel}
              data={selection}
              type={selection.type}
            />
          )}
        </CategoryShow>
      )}
    </>
  );
};
export default Category;
