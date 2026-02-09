import {Space,Button} from 'antd';
import {useState} from 'react';
const Dish = () => {
  const [selection,onSelect] = useState();
  const {pagination,setPagination,changePage,changeSize,changeArgs} = usePagination()
  const columns = [
    {
      label:"菜品名称",
      value:"name",
      key:"name",
    },
        {
      label:"图片",
      value:"img",
      key:"img",
    },
        {
      label:"菜品分类",
      value:"category",
      key:"category",
    },
        {
      label:"售价",
      value:"price",
      key:"price",
    },
        {
      label:"售卖状态",
      value:"status",
      key:"status",
    },
      {
      label:"最后操作",
      value:"updateTime",
      key:"updateTime",
    },
      {
      label:"操作",
      value:"name",
      key:"name",
      render:() => (
        <Button variant="link" color="bule">修改</Button>
        <Button variant="link" color="bule">删除</Button>
        <Button variant="link" color={selection.status === 1 ? 'red' : 'green'}>{selection.status === 1 ? '停售' : '启售'}</Button>
      )
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
    <Tabel 
      columns={columns}
      pagination={
        current:{pagination.page}
        pageSize:{pagination.pageSize}
      }
      />
  </>;
};
export default Dish;
