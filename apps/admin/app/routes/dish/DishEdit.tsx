import { Form, Button, Input, Select, Space } from "antd";
import { getByType } from "app/api/category";
import { update } from "app/api/dish";
import type { CategoryTableType } from "app/types/routes/category";
import { useEffect, useState } from "react";
import MyUpload from "app/components/Upload/MyUpload";
import styles from "./dish_flavors.module.css";
type DishAddType = {
  onOK: () => void;
  onCancel: () => void;
  data: any;
};
type DishFlavor = {
  name: string;
  value: number;
};
type ListItem = { label: string; value: number };
const DishAdd = (params: DishAddType) => {
  const { onOK, onCancel, data } = params;
  const [url, setUrl] = useState<string>();
  const [form] = Form.useForm<DishReq>();
  const [categoryList, setCategoryList] = useState<ListItem[]>();
  const [flavors, setFlavors] = useState<DishFlavor[]>([]);
  const onFinish = async (values: DishReq) => {
    values.status = 1;
    if (!url) return;
    console.log(url);
    values.image = url[0];
    console.log("values", values);
    await update(values);
    onOK();
  };
  const initialValues: DishReq = {
    id: 0,
    name: "",
    categoryId: 0,
    price: 0,
    flavors: [],
    image: [],
    description: "",
    status: 1,
  };
  let options: ListItem[] = [];
  const getList = async () => {
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
  const handleFlavors = (_: any, t: any) => {
    if (!t) return;
    const value: DishFlavor = {
      name: t?.label,
      value: t?.value,
    };
    const newFlavors = [...flavors, value];
    setFlavors(newFlavors);
    form.setFieldsValue({
      flavors: newFlavors,
    });

    console.log(value, form.getFieldsValue());
  };
  useEffect(() => {
    form.setFieldsValue(data);
    console.log("form", form.getFieldsValue());
    setUrl(form.getFieldsValue().image);
    setFlavors(form.getFieldsValue().flavors);
    getList();
  }, []);
  return (
    <Form form={form} onFinish={onFinish} initialValues={initialValues}>
      <Form.Item name="id" required hidden>
        <input disabled />
      </Form.Item>
      <Form.Item name="name" label="菜品名称" required>
        <Input placeholder="请输入菜品名称" />
      </Form.Item>
      <Form.Item name="categoryId" label="菜品分类" required>
        <Select options={categoryList} placeholder="请选择菜品分类" />
      </Form.Item>
      <Form.Item name="price" label="售价" required>
        <Input placeholder="请输入售价" suffix="元" />
      </Form.Item>
      <Form.Item name="flavors" label="口味做法配置">
        <Space className={styles.flavorContainer}>
          <Select
            style={{ width: "80px" }}
            options={[
              { label: "甜", value: 1 },
              { label: "辣", value: 2 },
              { label: "酸", value: 3 },
              { label: "苦", value: 4 },
            ]}
            onChange={handleFlavors}
            placeholder="请选择口味"
          />
          {flavors?.map((flavor, index) => (
            <Input
              key={index}
              value={flavor.name}
              placeholder={`口味 ${index + 1}`}
              style={{ display: "flex", width: "100px", marginLeft: 8 }}
            />
          ))}
        </Space>
      </Form.Item>
      <Form.Item name="image" label="图片" required>
        <MyUpload
          imageUrls={url!}
          setImageUrls={(url) => {
            setUrl(url);
          }}
        />
      </Form.Item>
      <Form.Item name="description" label="菜品描述">
        <Input placeholder="请输入菜品描述,最长200字" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          确认
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </Form.Item>
    </Form>
  );
};
export default DishAdd;
