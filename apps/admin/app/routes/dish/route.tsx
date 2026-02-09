import { Space, Button, Input, Select, Table, message } from 'antd'; // 补全导入的组件
import { useState, useEffect } from 'react';

// 模拟自定义分页 Hook（补齐缺失的依赖）
const usePagination = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  const changePage = (current: number) => {
    setPagination(prev => ({ ...prev, page: current }));
  };

  const changeSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize }));
  };

  const changeArgs = (args: any) => {
    setPagination(prev => ({ ...prev, ...args }));
  };

  return { pagination, setPagination, changePage, changeSize, changeArgs };
};

const Dish = () => {
  // 初始化 selection 默认值，避免 undefined 报错
  const [selection, setSelection] = useState<{ status?: number; id?: number }>({});
  // 模拟表格数据
  const [tableData, setTableData] = useState([]);
  
  const { pagination, setPagination, changePage, changeSize } = usePagination();

  // 表格列配置（修复拼写、包裹、逻辑错误）
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
  ];

  // 模拟获取列表数据
  const getList = async () => {
    try {
      // 实际项目中替换为真实接口请求
      // const res = await api.getDishList({
      //   name: searchName,
      //   category: searchCategory,
      //   status: searchStatus,
      //   page: pagination.page,
      //   pageSize: pagination.pageSize
      // });
      // 模拟数据
      const mockData = [
        {
          id: 1,
          name: "宫保鸡丁",
          img: "",
          category: "热菜",
          price: 28.8,
          status: 1,
          updateTime: "2026-02-10",
        },
        {
          id: 2,
          name: "鱼香肉丝",
          img: "",
          category: "热菜",
          price: 26.8,
          status: 2,
          updateTime: "2026-02-09",
        },
      ];
      setTableData(mockData);
      setPagination(prev => ({ ...prev, total: 10 })); // 模拟总条数
      message.success("查询成功");
    } catch (error) {
      message.error("查询失败");
      console.error("获取菜品列表失败：", error);
    }
  };

  // 搜索条件状态管理
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // 操作函数
  const handleEdit = (record: any) => {
    setSelection(record);
    // 此处可打开编辑弹窗逻辑
    message.info(`编辑菜品：${record.name}`);
  };

  const handleDelete = (record: any) => {
    // 实际项目中添加确认逻辑
    message.info(`删除菜品：${record.name}`);
  };

  const handleStatusToggle = (record: any) => {
    // 实际项目中调用接口修改状态
    const newStatus = record.status === 1 ? 2 : 1;
    setTableData(prev => 
      prev.map(item => item.id === record.id ? { ...item, status: newStatus } : item)
    );
    message.success(`菜品${record.name}已${newStatus === 1 ? '启售' : '停售'}`);
  };

  // 组件挂载时默认查询
  useEffect(() => {
    getList();
  }, [pagination.page, pagination.pageSize]);

  return (
    <>
      <Space size="middle" style={{ marginBottom: 16 }}>
        <div>菜品名称：</div>
        <Input 
          placeholder="请填写菜品名称" 
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <div>菜品分类：</div>
        <Select 
          placeholder="请选择"
          value={searchCategory}
          onChange={(value) => setSearchCategory(value)}
          options={[
            { value: 1, label: "热菜" },
            { value: 2, label: "凉菜" },
            { value: 3, label: "汤品" },
          ]}
        />
        <div>售卖状态：</div>
        <Select 
          placeholder="请选择"
          value={searchStatus}
          onChange={(value) => setSearchStatus(value)}
          options={[
            { value: 1, label: "启售" },
            { value: 2, label: "停售" },
          ]}
        />
        <Button onClick={() => getList()}>查询</Button>
        <Button variant="link" color="red">批量删除</Button>
        <Button type="primary">+新建菜品</Button>
      </Button>
      </Space>

      <Table 
        dataSource={tableData} // 绑定表格数据
        columns={columns}
        rowKey="id" // 必须指定唯一 key
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (current, pageSize) => {
            changePage(current);
            changeSize(pageSize);
          },
          showSizeChanger: true, // 显示每页条数切换
          showQuickJumper: true, // 显示快速跳转
        }}
      />
    </>
  );
};

export default Dish;
