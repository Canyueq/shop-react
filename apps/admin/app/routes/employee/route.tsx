import { useEffect, useState } from "react";
import EmployeeAdd from "./add";
import { Button, Input, message, Space, Table } from "antd";
import EmployeeShow from "./show";
import EmployeeEdit from "./edit";
import { getEmployeeList, setStatus, getEmployee } from "app/api/employee";
import { formatDateArray } from "app/utils/getFormatTime";
import { usePagination } from "app/hooks/usePagination";
import type {
  EmployeePaginaitonRes,
  Employee,
  EmployeeRes,
  EmployeePagination,
} from "app/types/api/employee";
import { debounce, throttle } from "app/utils/common";

const Employee = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [res, setRes] = useState<EmployeePaginaitonRes>();
  //多选可用通过rowSelection={{}}
  // const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>();
  const [selectedRow, setSelectedRow] = useState<Employee>();
  const [title, setTitle] = useState<string>("新增");
  const { pagination, changePage, changeSize, changeArgs } =
    usePagination<EmployeePagination>();
  const openDialog = (records?: Employee) => {
    setSelectedRow(records);
    setOpen(true);
  };
  const submit = () => {
    setOpen(false);
  };
  const close = () => {
    setOpen(false);
  };
  const changeStatus = async (obj: Employee | undefined) => {
    if (!obj) {
      message.error("请选择至少一行进行操作");
      return;
    }
    console.log("禁用", obj);
    const status = obj.status === 1 ? 0 : 1;
    return await setStatus(obj?.id, status)
      .then(() => {
        message.success(`已${obj.status === 1 ? "禁用" : "启用"}该员工`);
        // 局部更新：立即修改当前行的 status，按钮文字瞬间切换
        if (res?.data.records) {
          setRes({
            ...res,
            data: {
              ...res.data,
              records: res.data.records.map((item) =>
                item.id === obj.id ? { ...item, status: obj.status } : item,
              ),
            },
          });
        }
      })
      .catch((err) => {
        console.error("状态修改失败：", err);
        message.error("状态修改失败");
      });
  };
  const columns = [
    {
      title: "员工姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "账号",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "账号状态",
      dataIndex: "status",
      key: "status",
      render: (_: any, records: Employee) => (
        <div style={{ color: records.status === 1 ? "green" : "red" }}>
          {records.status === 1 ? "启用" : "禁用"}
        </div>
      ),
    },
    {
      title: "最后操作时间",
      dataIndex: "updateTime",
      key: "updateTime",
    },
    {
      title: "操作",
      align: "center" as const,
      dataIndex: "operation",
      key: "operation",
      render: (_: any, records: Employee) => (
        <>
          <Button
            variant="link"
            color="blue"
            onClick={async () => {
              setTitle("修改");
              const res: EmployeeRes = await getEmployee({
                id: records.id,
              } as any);
              console.log(res);
              openDialog(res.data);
            }}
          >
            修改
          </Button>
          <Button
            style={{ color: records.status ? "red" : "green" }}
            variant="link"
            color="red"
            onClick={async () => {
              await changeStatus(records);
              getList();
            }}
          >
            {records.status ? "禁用" : "启用"}
          </Button>
          <Button variant="link" color="red">
            删除
          </Button>
        </>
      ),
    },
  ];
  const getList = async () => {
    console.log("获取员工列表，当前分页参数：", pagination);
    const res: EmployeePaginaitonRes = await getEmployeeList(pagination);
    res.data.records.forEach((item) => {
      item.updateTime = formatDateArray(item.updateTime) as any;
    });
    setRes(res);
  };
  const handleChangePage = (current: number, pageSize: number) => {
    console.log("页码改变：", current, pageSize);
    changePage(current);
    changeSize(pageSize);
  };
  useEffect(() => {
    const throttleGet = throttle(getList, 2000);
    throttleGet();
  }, [pagination, open]);
  return (
    <>
      <div>员工管理</div>
      <Space style={{ justifyContent: "space-between" }}>
        <Space>
          <span>员工姓名</span>
          <Input
            placeholder="请输入员工姓名"
            value={pagination.name}
            onChange={(e) => changeArgs({ name: e.target.value })}
          />
          <Button type="primary" onClick={getList}>
            搜索
          </Button>
        </Space>
        <div style={{ marginLeft: "300px" }}>
          <Button
            onClick={() => {
              setTitle("新增");
              openDialog();
            }}
          >
            新增
          </Button>
        </div>
      </Space>
      <EmployeeShow open={open} onClose={close} title={title!}>
        {title === "新增" ? (
          <EmployeeAdd
            handleOk={submit}
            handleCancel={close}
            records={selectedRow}
          />
        ) : (
          <EmployeeEdit
            handleOk={submit}
            handleCancel={close}
            records={selectedRow}
          />
        )}
      </EmployeeShow>
      <Table<Employee>
        size="small"
        columns={columns}
        dataSource={res?.data.records}
        rowKey="id"
        style={{ margin: "10px" }}
        scroll={{ y: 420 }}
        pagination={{
          total: res?.data.total,
          current: pagination.page,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          onChange: handleChangePage,
        }}
      ></Table>
    </>
  );
};
export default Employee;
