import {Space,Button} from 'antd';
import {useState} from 'react';
const Dish = () => {
  const [selection,onSelect] = useState();
  const {pagination,setPagination,changePage,changeSize,changeArgs} = usePagination()
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
      render: (img: string) => img ? <img src={img} width="50" alt="菜品" /> : '无图片',
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
        <span style={{ color: status === 1 ? 'green' : 'red' }}>
          {status === 1 ? '启售' : '停售'}
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
      render: (record: any) => (
        <Space size="small"> {/* 用 Space 包裹多个 Button */}
          <Button variant="link" color="blue" onClick={() => handleEdit(record)}>修改</Button>
          <Button variant="link" color="blue" onClick={() => handleDelete(record)}>删除</Button>
          <Button 
            variant="link" 
            color={record.status === 1 ? 'red' : 'green'}
            onClick={() => handleStatusToggle(record)}
          >
            {record.status === 1 ? '停售' : '启售'}
          </Button>
        </Space>
      ),
    },
  ]
  const getList = async() => {
    await 
  }
  return <>
  <Space>
    <div>菜品名称：</div>
    <Input placeholder="请填写菜品名称"/>
        <div>菜品分类：</div>
    <Select placeholder="请选择"
      options={
        [
          {value:1,label:""},
        ]
      }
      />
        <div>售卖状态：</div>
    <Select placeholder="请选择"
      options={
        [
          {value:1,label:"启售"},
          {value:2,label:"停售"},
        ]
      }/>
    <Button onClick={() => getList()}>查询</Button>
    <Button variant="link" color="red">批量删除</Button>
    <Button>+新建菜品</Button>
  </Space>
    <Table 
      columns={columns}
      pagination={
        current:{pagination.page}
        pageSize:{pagination.pageSize}
        onChange:(current,pageSize) => {
          changePage(current)
          changeSize(pageSize)
        }
      }
      />
  </>;
};
export default Dish;
