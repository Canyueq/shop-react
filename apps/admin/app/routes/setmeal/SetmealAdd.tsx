import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Table,
  type TableProps,
} from "antd";
import { add } from "app/api/setmeal";
import type { SetmealTableItem } from "./types/Setmeal";
import DishAdd from "./DishAdd";
import { useEffect, useState } from "react";
import { getByType } from "app/api/category";
import ImageUpload from "app/components/Upload/ImageUpload";
import type { SetmealAddReq } from "./types/api";
type SetmalAddType = {
  close: () => void;
};
const SetmalAdd = ({ close }: SetmalAddType) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState();
  const [dishData, setDishData] = useState(form.getFieldValue("setmealDishes"));
  const onFinish = async (values: SetmealAddReq) => {
    const data: SetmealAddReq = {
      ...values,
      status: 1,
    };
    await add(data).then(() => {
      close();
    });
  };
  const handleDishData = (data: any) => [
    form.setFieldValue("setmealDishes", data),
  ];
  const handleIamgeUrl = (url: string) => {
    form.setFieldValue("image", url);
  };
  const handleCancel = () => {
    close();
  };
  const handleCategorySelect = (id: number) => {
    form.setFieldValue("categortId", id);
  };
  const handleOpenClick = () => {
    setOpen(true);
  };
  const getTableConfig = (): TableProps => ({
    dataSource: dishData,
    columns: [
      { title: "菜品名称", dataIndex: "name", key: "name" },
      { title: "原价", dataIndex: "price", key: "price" },
      {
        title: "份数",
        dataIndex: "copies",
        key: "copies",
        render: (copies, record, index) => (
          <Space>
            <Button
              onClick={() => {
                const dishList = form.getFieldValue("setmealDishes") || [];
                const newDishList = [...dishList];
                newDishList[index] = {
                  ...newDishList[index],
                  copies: Math.max(1, newDishList[index].copies - 1),
                };
                form.setFieldValue("dish", newDishList);
                setDishData(newDishList);
              }}
            >
              -
            </Button>
            {copies}
            <Button
              onClick={() => {
                const dishList = form.getFieldValue("setmealDishes") || [];
                const newDishList = [...dishList];
                newDishList[index] = {
                  ...newDishList[index],
                  copies: newDishList[index].copies + 1,
                };
                form.setFieldValue("setmealDishes", newDishList);
                console.log(form.getFieldValue("setmealDishes"));
                setDishData(newDishList);
              }}
            >
              +
            </Button>
          </Space>
        ),
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        render: () => (
          <Button variant="link" color="red">
            删除
          </Button>
        ),
      },
    ],
    pagination: false,
    rowKey: "id",
  });
  useEffect(() => {
    (async () => {
      await getByType(2).then((res) => {
        res.data.map((item: any) => {
          item.label = item.name;
          item.key = item.id;
          item.value = item.id;
        });
        setCategoryOptions(res.data);
      });
    })();
  }, []);
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="name" label="套餐名称">
        <Input placeholder="请输入套餐名称" />
      </Form.Item>
      <Form.Item name="categoryId" label="套餐分类">
        <Select
          placeholder="请选择套餐分类"
          options={categoryOptions}
          onSelect={handleCategorySelect}
        />
      </Form.Item>
      <Form.Item name="price" label="套餐价格">
        <Input placeholder="请输入套餐价格" suffix="元" />
      </Form.Item>
      <Form.Item name="setmealDishes" label="套餐菜品">
        <Button type="primary" onClick={handleOpenClick}>
          添加菜品
        </Button>
        <Table {...getTableConfig()} />
      </Form.Item>
      <Form.Item name="image" label="套餐图片">
        <ImageUpload
          url={form.getFieldsValue().image}
          setUrl={handleIamgeUrl}
        />
      </Form.Item>
      <Form.Item name="description" label="套餐描述">
        <Input placeholder="请输入套餐描述" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
        <Button onClick={handleCancel}>取消</Button>
      </Form.Item>
      {open && (
        <DishAdd
          open={open}
          close={() => {
            setOpen(false);
            setDishData(form.getFieldValue("setmealDishes"));
          }}
          setDishTable={handleDishData}
        />
      )}
    </Form>
  );
};
export default SetmalAdd;
