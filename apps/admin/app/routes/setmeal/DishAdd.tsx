import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
  type ModalProps,
  type TableProps,
} from "antd";
import { getByCategoryId } from "app/api/dish";
import React, { useEffect, useState, type MouseEventHandler } from "react";
type DishAddType = {
  open: boolean;
  close: () => void;
  setDishTable: (data: any) => void;
};
const DishAdd = ({ open, close, setDishTable }: DishAddType) => {
  const [count, setConut] = useState(0);
  const [name, setName] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();
  const [selection, setSelection] = useState([]);
  const [tableData, setTableData] = useState([]);
  const handleNameInput = (e: React.InputEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value);
    setName(e.currentTarget.value);
  };
  const handleSubmit = () => {
    const data: any = [];
    selection.forEach((item: any) => {
      data.push({
        dishId: item.id,
        name: item.name,
        price: item.price,
        copies: 1,
      });
    });
    setDishTable(data);
    close();
  };
  const handleCancel = () => {
    close();
  };
  const handleRowChange = () => {};
  const handleRowSelect = (e: React.Key[]) => {
    console.log("e", e);
    setSelectedRowKeys(e);
    const select: any = [...selection];
    tableData.map((item: any) => {
      if (item.id === e.at(-1)) {
        select.push(item);
      }
    });
    setSelection(select);
    setConut((pre) => pre + 1);
    console.log(selection);
  };
  const modal: ModalProps = {
    width: "1000px",
    title: "添加菜品",
    open: open,
    closeIcon: null,
    footer: null,
  };
  const table: TableProps = {
    rowKey: "id",
    dataSource: tableData,
    columns: [
      { dataIndex: "name", key: "name" },
      { dataIndex: "status", key: "status" },
      { dataIndex: "price", key: "price" },
    ],
    rowSelection: {
      selectedRowKeys,
      onChange: handleRowSelect,
    },
    onChange: handleRowChange,
    scroll: { y: 500 },
    showSorterTooltip: false,
    pagination: false,
  };
  useEffect(() => {
    (async () => {
      await getByCategoryId(name!).then((res) => {
        setTableData(res.data);
      });
    })();
  }, [name]);
  return (
    <Modal {...modal}>
      <Row gutter={20}>
        <Col span="12">
          <Input
            value={name}
            placeholder="请输入菜品名称进行搜索"
            onInput={handleNameInput}
          />
          <Row gutter={20}>
            <Col span={6}>
              <Button variant="link" color="blue">
                荤菜
              </Button>
              <Button variant="link" color="green">
                素菜
              </Button>
            </Col>
            <Col span={18}>
              <Table {...table} />
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <div>{`已选菜品(${count})`}</div>
          <Table
            rowKey={"id"}
            dataSource={selection}
            columns={[
              { title: "名称", dataIndex: "name", key: "name" },
              { title: "价格", dataIndex: "price", key: "price" },
              {
                title: "操作",
                render: (row) => (
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() => {
                      const select = selection.filter(
                        (item: any) => item.id !== row.id,
                      );
                      const keySelect = selectedRowKeys?.filter(
                        (item) => item !== row.id,
                      );
                      console.log(select);
                      setSelection(select);
                      setSelectedRowKeys(keySelect);
                      setConut((pre) => pre - 1);
                    }}
                  ></Button>
                ),
              },
            ]}
            pagination={false}
          />
        </Col>
      </Row>
      <Space>
        <Button type="primary" onClick={handleSubmit}>
          添加
        </Button>
        <Button onClick={handleCancel}>取消</Button>
      </Space>
    </Modal>
  );
};
export default DishAdd;
